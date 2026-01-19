import { MaterialIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

interface Vehicle {
  id: string
  name: string
  status: string
  statusColor: string // Hex or theme key
  statusTextColor: string
  lastUpdated: string
  distance: string
  efficiency: string
  efficiencyUnit: string
  efficiencyColor: string
  bgImage: string
  type: 'gas' | 'electric'
  logLabel: string
  logIcon: keyof typeof MaterialIcons.glyphMap
}

const VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: 'Mazda 3',
    status: 'ACTIVE',
    statusColor: '#006c75', // primary
    statusTextColor: '#FFFFFF',
    lastUpdated: 'Last refueled 2 days ago',
    distance: '42,500 km',
    efficiency: '12.5',
    efficiencyUnit: 'KM/L AVG',
    efficiencyColor: '#FF7F11', // accent-orange
    bgImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDSBF2pKWu-BM6f3FgAoVqmt6RZaNAfXFOhMC3pR7gQCKuYo_kyR9eXUmQwUn-FESvWLzwieeQpTr9BRZUAMAxMY3Mcx6SfgGPP_ewOxi8OhIQTwuA2GZ8xAIkiXVBH4RCzoWl8Vn2mOtWd7QkfWRa6nnDEcHiSteWxmlovbABRE-2v6IZuCldm-gWRS3zuPgBGLeaWIX67APUA0QSu7Sl_nIoHsfTMkKS4IGRhOr-nZKQlAji0Tyc-_kb9jqwQqudc6A9ZQnbNEmo',
    type: 'gas',
    logLabel: 'Log Fuel',
    logIcon: 'local-gas-station'
  },
  {
    id: '2',
    name: 'VW Golf',
    status: 'IDLE',
    statusColor: 'rgba(255, 255, 255, 0.1)',
    statusTextColor: '#8dc9ce',
    lastUpdated: 'Last refueled 1 week ago',
    distance: '18,210 km',
    efficiency: '15.2',
    efficiencyUnit: 'KM/L AVG',
    efficiencyColor: '#FF7F11',
    bgImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmrA0AKsSMRz6D-Q-W7gzIb2Vmv-vFpKeY4Qf5XBu0qfFB5-loOqHkpPKJQ4QBkmrFnGPMyjJbUe5PffNbPa2lr7alVIopnDkj_9AZPdf6OesQ45sC_tVc7JmaDHo10JUoQsK7cZ7mOYwVvmFwlMCGI-9aob36FHXU3kRzK9uZp-e-A41KOSBSqpLyBjCn56nUzcH6fjmAXrI48znOxOTaOmzz8jaCCDPHDY6eoiFmUjrf06-Tc_vdi5xELlPwLs5bufYwBN0GnOY',
    type: 'gas',
    logLabel: 'Log Fuel',
    logIcon: 'local-gas-station'
  },
  {
    id: '3',
    name: 'Tesla Model 3',
    status: 'ELECTRIC',
    statusColor: '#10b981', // emerald-500
    statusTextColor: '#FFFFFF',
    lastUpdated: 'Last charged yesterday',
    distance: '12,400 km',
    efficiency: '185',
    efficiencyUnit: 'WH/KM AVG',
    efficiencyColor: '#FF7F11',
    bgImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdxZYHzs0ru-4RLSCCUW6FO_Wz3x_EOcw_i4P-HQjYhppAkF5XDsQaY0ddL3huhwEeYfnCG1npxzVtMUdU2nQHGHZMwOXFt9AYcsqC8JrJXCiUeDw5qk6gF9M6QVc1XcjwG3lLvcF_hXO3FEKLr3LOozG1vPLfaVieXIZ-Yo87yeoOdEJ6JHCsushhm9oZSVWLZZjRv7zqQjTcSi_FgH_CZl5gc1DD5BF63SWmfDWeqdvlfclMLmNR0i9j4Lw5_dElv1LKCtj6_x8',
    type: 'electric',
    logLabel: 'Log Charge',
    logIcon: 'ev-station'
  }
]

type StatCardProps = {
  label: string
  value: string | number
  unit?: string
  isDark: boolean
  accentColor?: string
  variant?: 'primary' | 'secondary'
}

function StatCard ({ label, value, unit, isDark, accentColor, variant = 'secondary' }: StatCardProps): React.ReactElement {
  const cardStyle = [
    styles.statCard,
    variant === 'primary' ? styles.statCardPrimary : (isDark ? styles.statCardSecondaryDark : styles.statCardSecondaryLight)
  ]

  return (
    <View style={cardStyle}>
      <ThemedText style={[styles.statLabel, accentColor ? { color: accentColor } : undefined]}>
        {label}
      </ThemedText>
      <View style={[styles.rowCenter, {alignItems: 'baseline'}]}>
        <ThemedText style={[styles.statValue, variant === 'secondary' ? { color: '#FF7F11' } : undefined]}>
          {value}
        </ThemedText>
        {unit && <ThemedText style={styles.statUnit}> {unit}</ThemedText>}
      </View>
    </View>
  )
}

type VehicleCardProps = {
  item: Vehicle
  isDark: boolean
  primaryColor: string
  textColor: string
}

function VehicleCard ({ item, isDark, primaryColor, textColor }: VehicleCardProps): React.ReactElement {
  return (
    <View
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.statusColor }
              ]}
            >
              <ThemedText
                style={[styles.statusText, { color: item.statusTextColor }]}
              >
                {item.status}
              </ThemedText>
            </View>
            <ThemedText style={styles.lastUpdatedText}>
              {item.lastUpdated}
            </ThemedText>
          </View>
          <ThemedText style={styles.vehicleName}>{item.name}</ThemedText>
          <ThemedText style={styles.odometerText}>
            {item.distance} • Odometer
          </ThemedText>
        </View>
        <View style={styles.efficiencyContainer}>
          <ThemedText
            style={[styles.efficiencyValue, { color: item.efficiencyColor }]}
          >
            {item.efficiency}
          </ThemedText>
          <ThemedText style={styles.efficiencyUnit}>
            {item.efficiencyUnit}
          </ThemedText>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.logButton, { backgroundColor: primaryColor }]}
          activeOpacity={0.9}
        >
          <MaterialIcons name={item.logIcon} size={18} color='#FFF' />
          <ThemedText style={styles.logButtonText}>{item.logLabel}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.arrowButton,
            isDark ? styles.arrowButtonDark : styles.arrowButtonLight
          ]}
          activeOpacity={0.7}
        >
          <MaterialIcons name='arrow-forward' size={20} color={textColor} />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: item.bgImage }}
        style={styles.cardBgImage}
        contentFit='cover'
        transition={1000}
      />
    </View>
  )
}

export default function HomeScreen (): React.ReactElement {
  const colorScheme = useColorScheme() ?? 'light'
  const theme = Colors[colorScheme]
  const isDark = colorScheme === 'dark'

  const renderHeader = (): React.ReactElement => (
    <View style={styles.contentContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScrollContent}
        style={styles.statsScroll}
      >
        <StatCard
          label='TOTAL FLEET'
          value='3 Vehicles'
          isDark={isDark}
          accentColor={theme.primary}
          variant='primary'
        />

        <StatCard
          label='AVG. EFFICIENCY'
          value='14.8'
          unit='km/L'
          isDark={isDark}
          accentColor='#8dc9ce'
        />

        <StatCard
          label='ACTIVE LOGS'
          value='128'
          isDark={isDark}
          accentColor='#8dc9ce'
        />
      </ScrollView>
    </View>
  )

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View
        style={[
          styles.header,
          isDark ? styles.headerDark : styles.headerLight
        ]}
      >
        <ThemedText style={styles.headerTitle}>My Garage</ThemedText>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              isDark ? styles.iconButtonDark : styles.iconButtonLight
            ]}
          >
            <MaterialIcons
              name='search'
              size={20}
              color={isDark ? '#FFF' : '#000'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              isDark ? styles.iconButtonDark : styles.iconButtonLight
            ]}
          >
            <MaterialIcons
              name='settings'
              size={20}
              color={isDark ? '#FFF' : '#000'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={VEHICLES}
        renderItem={({ item }) => (
          <VehicleCard
            item={item}
            isDark={isDark}
            primaryColor={theme.primary}
            textColor={theme.text}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[
            styles.fab,
            {
              backgroundColor: theme.primary,
              shadowColor: theme.primary,
              borderColor: theme.background
            }
          ]}
        >
          <MaterialIcons name='add' size={32} color='#FFF' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1
  },
  headerDark: {
    backgroundColor: 'rgba(21, 30, 31, 0.95)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)'
  },
  headerLight: {
    backgroundColor: 'rgba(249, 250, 250, 0.95)',
    borderBottomColor: '#e2e8f0'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  iconButtonLight: {
    backgroundColor: '#f1f5f9'
  },
  contentContainer: {
    paddingVertical: 24
  },
  statsScroll: {
    paddingLeft: 24
  },
  statsScrollContent: {
    gap: 16,
    paddingRight: 24
  },
  statCard: {
    minWidth: 140,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1
  },
  statCardPrimary: {
    backgroundColor: 'rgba(0, 108, 117, 0.1)',
    borderColor: 'rgba(0, 108, 117, 0.2)'
  },
  statCardSecondaryDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  statCardSecondaryLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(0, 0, 0, 0.05)'
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800'
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '400',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
    gap: 20
  },
  card: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  cardDark: {
    backgroundColor: '#232E2F',
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#e2e8f0'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10
  },
  cardInfo: {
    flex: 1
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700'
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#8dc9ce',
    fontWeight: '500'
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4
  },
  odometerText: {
    fontSize: 14,
    color: '#8dc9ce',
    fontWeight: '500'
  },
  efficiencyContainer: {
    alignItems: 'flex-end'
  },
  efficiencyValue: {
    fontSize: 24,
    fontWeight: '800'
  },
  efficiencyUnit: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8dc9ce',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
    zIndex: 10
  },
  logButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8
  },
  logButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14
  },
  arrowButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1
  },
  arrowButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  arrowButtonLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  cardBgImage: {
    position: 'absolute',
    bottom: -32,
    right: -32,
    width: 192,
    height: 192,
    opacity: 0.1,
    transform: [{ rotate: '0deg' }] // ensure simple transform
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 50
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4
  }
})
