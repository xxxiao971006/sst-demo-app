import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { authMiddleware } from '@my-sst-app/core/auth'
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

const app = new Hono()

const s3 = new S3Client({ })

const randomString = (length: number) => crypto.randomBytes(length).toString('hex')

app.post('/signed-url', authMiddleware, async (c) => {
    const userId = c.var.userId
    const imageName = randomString(16)
    const { contentType, contentLength, checksum } = await c.req.json()

    if(contentLength > 1024 * 1024 * 10) {
        return c.json({ error: 'File size must be less than 10MB' }, 400)
    }

    const putCommand = new PutObjectCommand({
        ACL: 'public-read',
        Bucket: process.env.ASSETS_BUCKET_NAME!,
        Key: imageName,
        ContentType: contentType,
        ContentLength: contentLength,
        ChecksumSHA256: checksum,
    })

    const url = await getSignedUrl(s3, putCommand, { expiresIn: 60 * 5 })

    return c.json({ url })

})

app.delete('/delete-object/:key', authMiddleware, async (c) => {
    const key = c.req.param('key')

    const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.ASSETS_BUCKET_NAME!,
        Key: key,
    })

    try {
        await s3.send(deleteCommand)
        return c.json({ message: 'Object deleted successfully' })
    } catch (error) {
        console.error('Error deleting object from S3:', error)
        return c.json({ error: 'Failed to delete object from S3' }, 500)
    }
})

export const handler = handle(app)