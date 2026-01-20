import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { db } from '@/db'
import migrations from '@/drizzle/migrations'
import { useColorScheme } from '@/hooks/use-color-scheme'

export const unstable_settings = {
  anchor: '(tabs)'
}

export default function RootLayout (): React.ReactElement {
  const colorScheme = useColorScheme()
  const { success, error } = useMigrations(db, migrations)

  useEffect(() => {
    if (error) {
      console.error('Migration error:', error)
    }
  }, [error])

  if (!success) return <></>

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='modal' options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style='auto' />
    </ThemeProvider>
  )
}
