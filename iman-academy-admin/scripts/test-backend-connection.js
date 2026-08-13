const axios = require('axios')
const fs = require('fs')
const path = require('path')

const envPath = path.resolve(__dirname, '..', '.env')
let API_URL = 'http://localhost:3000'
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8')
  const m = env.match(/NEXT_PUBLIC_API_URL=(.*)/)
  if (m) API_URL = m[1].trim()
}

(async () => {
  try {
    console.log('Requesting', `${API_URL}/api/courses`)
    const res = await axios.get(`${API_URL}/api/courses`, { timeout: 5000 })
    console.log('Status:', res.status)
    console.log('Body preview:', JSON.stringify(res.data).slice(0, 500))
  } catch (err) {
    console.error('Request failed:', err.message)
    process.exit(1)
  }
})()
