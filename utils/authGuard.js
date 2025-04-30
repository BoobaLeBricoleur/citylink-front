import axios from 'axios'

export async function verifyAndLoadProfile(router, API_URL) {

  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  console.log('Token:', token)
  console.log('storedUser:', storedUser)

  if (!token || !storedUser) {
    router.push('/account')
    return null
  }

  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.data || response.data.role_id !== 1) {
      router.push('/account')
      return null
    }
    return response.data
  } catch (err) {
    router.push('/account')
    return null
  }
}