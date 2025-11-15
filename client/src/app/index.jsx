import { Redirect }            from "expo-router"
import { useEffect, useState } from "react"
import { getSession }          from "../services/handleSession"

export default function Index() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const check = async () => {
      const session = await getSession()
      setLoggedIn(!!session)
      setLoading(false)
    }
    check()
  }, [])

  if (loading) return null

  return loggedIn
    ? <Redirect href="/(tabs)/tasks" />
    : <Redirect href="/(auth)/login" />
}
