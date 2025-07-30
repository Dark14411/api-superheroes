"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Gem,
  Crown,
  Star,
  Zap,
  Target,
  Gift,
  Award,
  Coins,
  CreditCard,
  Wallet,
  PiggyBank,
  BarChart3,
  LineChart,
  PieChart,
  Building,
  Factory,
  Store,
  Briefcase,
  Calculator,
  Calendar,
  Clock,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Economy {
  coins: number
  premiumCoins: number
  gems: number
  experience: number
  level: number
  creditScore: number
  bankBalance: number
  investments: Investment[]
  ownedItems: Item[]
  marketHistory: Transaction[]
  dailyIncome: number
  weeklySpending: number
}

interface Item {
  id: string
  name: string
  description: string
  category: 'pet' | 'decoration' | 'boost' | 'premium' | 'nft' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  price: number
  currency: 'coins' | 'gems' | 'premiumCoins'
  marketValue: number
  demand: number
  supply: number
  priceHistory: number[]
  effects?: any
  tradeable: boolean
  limited: boolean
  owned: number
}

interface Investment {
  id: string
  name: string
  type: 'stock' | 'bond' | 'crypto' | 'business' | 'property'
  invested: number
  currentValue: number
  dailyReturn: number
  risk: 'low' | 'medium' | 'high'
  duration: number
  description: string
}

interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'trade' | 'invest' | 'withdraw'
  itemId?: string
  amount: number
  currency: string
  timestamp: Date
  profit?: number
}

export default function AdvancedEconomyMarketplace({ 
  economy, 
  setEconomy 
}: {
  economy: Economy
  setEconomy: (fn: (prev: Economy) => Economy) => void
}) {
  const [marketItems, setMarketItems] = useState<Item[]>([
    {
      id: 'golden_pou',
      name: 'Pou Dorado',
      description: 'Un Pou legendario que genera monedas automáticamente',
      category: 'pet',
      rarity: 'legendary',
      price: 50000,
      currency: 'coins',
      marketValue: 52000,
      demand: 85,
      supply: 12,
      priceHistory: [48000, 49500, 51000, 52000],
      effects: { coinGeneration: 500, happiness: 25 },
      tradeable: true,
      limited: true,
      owned: 0
    },
    {
      id: 'diamond_crown',
      name: 'Corona de Diamante',
      description: 'Aumenta todas las recompensas un 50%',
      category: 'decoration',
      rarity: 'mythic',
      price: 100,
      currency: 'gems',
      marketValue: 110,
      demand: 95,
      supply: 5,
      priceHistory: [95, 102, 108, 110],
      effects: { rewardMultiplier: 1.5 },
      tradeable: true,
      limited: true,
      owned: 0
    },
    {
      id: 'xp_booster',
      name: 'Multiplicador XP x3',
      description: 'Triplica la experiencia ganada por 24 horas',
      category: 'boost',
      rarity: 'epic',
      price: 25,
      currency: 'premiumCoins',
      marketValue: 28,
      demand: 70,
      supply: 50,
      priceHistory: [22, 25, 26, 28],
      effects: { xpMultiplier: 3, duration: 86400 },
      tradeable: false,
      limited: false,
      owned: 0
    },
    {
      id: 'crypto_pou_nft',
      name: 'CryptoPou NFT #001',
      description: 'NFT único de Pou con blockchain verificado',
      category: 'nft',
      rarity: 'mythic',
      price: 500,
      currency: 'premiumCoins',
      marketValue: 750,
      demand: 100,
      supply: 1,
      priceHistory: [400, 550, 700, 750],
      effects: { prestige: 100, uniqueSkills: true },
      tradeable: true,
      limited: true,
      owned: 0
    }
  ])

  const [availableInvestments] = useState<Investment[]>([
    {
      id: 'pou_inc',
      name: 'Pou Industries Inc.',
      type: 'stock',
      invested: 0,
      currentValue: 0,
      dailyReturn: 0.05,
      risk: 'medium',
      duration: 0,
      description: 'Acciones de la empresa madre de Pou'
    },
    {
      id: 'crypto_coin',
      name: 'PouCoin (POC)',
      type: 'crypto',
      invested: 0,
      currentValue: 0,
      dailyReturn: 0.12,
      risk: 'high',
      duration: 0,
      description: 'Criptomoneda oficial del ecosistema Pou'
    },
    {
      id: 'pou_cafe',
      name: 'Cadena de Cafeterías Pou',
      type: 'business',
      invested: 0,
      currentValue: 0,
      dailyReturn: 0.03,
      risk: 'low',
      duration: 0,
      description: 'Franquicia de cafeterías temáticas'
    },
    {
      id: 'gaming_bonds',
      name: 'Bonos de Gaming',
      type: 'bond',
      invested: 0,
      currentValue: 0,
      dailyReturn: 0.02,
      risk: 'low',
      duration: 0,
      description: 'Bonos gubernamentales de la industria gaming'
    }
  ])

  const [marketFilter, setMarketFilter] = useState('all')
  const [sortBy, setSortBy] = useState('price')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [tradeAmount, setTradeAmount] = useState(1)
  const [portfolioView, setPortfolioView] = useState('overview')
  const [priceAlerts, setPriceAlerts] = useState<any[]>([])

  // Simulación de fluctuaciones del mercado
  useEffect(() => {
    const marketTicker = setInterval(() => {
      setMarketItems(prev => prev.map(item => {
        const volatility = item.rarity === 'mythic' ? 0.1 : 
                          item.rarity === 'legendary' ? 0.08 :
                          item.rarity === 'epic' ? 0.06 : 0.04

        const change = (Math.random() - 0.5) * volatility
        const newPrice = Math.max(1, item.marketValue * (1 + change))
        
        return {
          ...item,
          marketValue: Math.floor(newPrice),
          priceHistory: [...item.priceHistory.slice(-9), Math.floor(newPrice)],
          demand: Math.max(0, Math.min(100, item.demand + (Math.random() - 0.5) * 10))
        }
      }))
    }, 5000)

    return () => clearInterval(marketTicker)
  }, [])

  // Actualizar inversiones
  useEffect(() => {
    const investmentUpdate = setInterval(() => {
      setEconomy(prev => ({
        ...prev,
        investments: prev.investments.map(inv => {
          const baseReturn = inv.dailyReturn / 24 // Por hora
          const volatility = inv.risk === 'high' ? 0.3 : inv.risk === 'medium' ? 0.15 : 0.05
          const change = (Math.random() - 0.5) * volatility
          const actualReturn = baseReturn * (1 + change)
          
          return {
            ...inv,
            currentValue: inv.currentValue * (1 + actualReturn),
            duration: inv.duration + 1
          }
        })
      }))
    }, 3600000) // Cada hora

    return () => clearInterval(investmentUpdate)
  }, [])

  // Comprar item
  const buyItem = (item: Item) => {
    const totalCost = item.price * tradeAmount
    
    if (getCurrencyBalance(item.currency) < totalCost) {
      toast.error("Fondos insuficientes")
      return
    }

    if (item.limited && item.supply < tradeAmount) {
      toast.error("Stock insuficiente")
      return
    }

    setEconomy(prev => {
      const updatedEconomy = { ...prev }
      
      // Restar dinero
      if (item.currency === 'coins') updatedEconomy.coins -= totalCost
      else if (item.currency === 'gems') updatedEconomy.gems -= totalCost
      else if (item.currency === 'premiumCoins') updatedEconomy.premiumCoins -= totalCost

      // Añadir item al inventario
      const existingItem = updatedEconomy.ownedItems.find(owned => owned.id === item.id)
      if (existingItem) {
        existingItem.owned += tradeAmount
      } else {
        updatedEconomy.ownedItems.push({ ...item, owned: tradeAmount })
      }

      // Registrar transacción
      updatedEconomy.marketHistory.push({
        id: Date.now().toString(),
        type: 'buy',
        itemId: item.id,
        amount: totalCost,
        currency: item.currency,
        timestamp: new Date()
      })

      return updatedEconomy
    })

    // Actualizar oferta del mercado
    if (item.limited) {
      setMarketItems(prev => prev.map(marketItem => 
        marketItem.id === item.id 
          ? { ...marketItem, supply: marketItem.supply - tradeAmount }
          : marketItem
      ))
    }

    toast.success(`¡Compraste ${tradeAmount}x ${item.name}!`)
    setSelectedItem(null)
    setTradeAmount(1)
  }

  // Vender item
  const sellItem = (item: Item) => {
    const ownedItem = economy.ownedItems.find(owned => owned.id === item.id)
    if (!ownedItem || ownedItem.owned < tradeAmount) {
      toast.error("No tienes suficientes items para vender")
      return
    }

    const sellPrice = Math.floor(item.marketValue * 0.85) // 15% comisión del mercado
    const totalEarnings = sellPrice * tradeAmount

    setEconomy(prev => {
      const updatedEconomy = { ...prev }
      
      // Añadir dinero
      if (item.currency === 'coins') updatedEconomy.coins += totalEarnings
      else if (item.currency === 'gems') updatedEconomy.gems += totalEarnings
      else if (item.currency === 'premiumCoins') updatedEconomy.premiumCoins += totalEarnings

      // Remover item del inventario
      const ownedIndex = updatedEconomy.ownedItems.findIndex(owned => owned.id === item.id)
      if (ownedIndex !== -1) {
        updatedEconomy.ownedItems[ownedIndex].owned -= tradeAmount
        if (updatedEconomy.ownedItems[ownedIndex].owned <= 0) {
          updatedEconomy.ownedItems.splice(ownedIndex, 1)
        }
      }

      // Registrar transacción
      const originalCost = economy.marketHistory
        .filter(t => t.type === 'buy' && t.itemId === item.id)
        .reduce((sum, t) => sum + t.amount, 0) / 
        economy.ownedItems.find(o => o.id === item.id)?.owned || 1

      updatedEconomy.marketHistory.push({
        id: Date.now().toString(),
        type: 'sell',
        itemId: item.id,
        amount: totalEarnings,
        currency: item.currency,
        timestamp: new Date(),
        profit: totalEarnings - (originalCost * tradeAmount)
      })

      return updatedEconomy
    })

    toast.success(`¡Vendiste ${tradeAmount}x ${item.name} por ${totalEarnings} ${item.currency}!`)
    setSelectedItem(null)
    setTradeAmount(1)
  }

  // Invertir
  const invest = (investment: Investment, amount: number) => {
    if (economy.coins < amount) {
      toast.error("Fondos insuficientes para invertir")
      return
    }

    setEconomy(prev => {
      const updatedEconomy = { ...prev }
      updatedEconomy.coins -= amount

      const existingInvestment = updatedEconomy.investments.find(inv => inv.id === investment.id)
      if (existingInvestment) {
        existingInvestment.invested += amount
        existingInvestment.currentValue += amount
      } else {
        updatedEconomy.investments.push({
          ...investment,
          invested: amount,
          currentValue: amount
        })
      }

      updatedEconomy.marketHistory.push({
        id: Date.now().toString(),
        type: 'invest',
        amount,
        currency: 'coins',
        timestamp: new Date()
      })

      return updatedEconomy
    })

    toast.success(`¡Invertiste ${amount} monedas en ${investment.name}!`)
  }

  // Retirar inversión
  const withdrawInvestment = (investmentId: string) => {
    const investment = economy.investments.find(inv => inv.id === investmentId)
    if (!investment) return

    const earnings = Math.floor(investment.currentValue)
    const profit = earnings - investment.invested

    setEconomy(prev => {
      const updatedEconomy = { ...prev }
      updatedEconomy.coins += earnings
      updatedEconomy.investments = updatedEconomy.investments.filter(inv => inv.id !== investmentId)

      updatedEconomy.marketHistory.push({
        id: Date.now().toString(),
        type: 'withdraw',
        amount: earnings,
        currency: 'coins',
        timestamp: new Date(),
        profit
      })

      return updatedEconomy
    })

    toast.success(`¡Retiraste ${earnings} monedas! Ganancia: ${profit > 0 ? '+' : ''}${profit}`)
  }

  // Obtener balance de moneda
  const getCurrencyBalance = (currency: string) => {
    switch (currency) {
      case 'coins': return economy.coins
      case 'gems': return economy.gems
      case 'premiumCoins': return economy.premiumCoins
      default: return 0
    }
  }

  // Filtrar items del mercado
  const filteredItems = marketItems
    .filter(item => marketFilter === 'all' || item.category === marketFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price': return a.price - b.price
        case 'rarity': 
          const rarityOrder = { 'common': 1, 'rare': 2, 'epic': 3, 'legendary': 4, 'mythic': 5 }
          return rarityOrder[b.rarity] - rarityOrder[a.rarity]
        case 'demand': return b.demand - a.demand
        case 'trending':
          const aTrend = a.priceHistory[a.priceHistory.length - 1] - a.priceHistory[a.priceHistory.length - 2]
          const bTrend = b.priceHistory[b.priceHistory.length - 1] - b.priceHistory[b.priceHistory.length - 2]
          return bTrend - aTrend
        default: return a.name.localeCompare(b.name)
      }
    })

  // Calcular valor total del portafolio
  const totalPortfolioValue = economy.investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalInvested = economy.investments.reduce((sum, inv) => sum + inv.invested, 0)
  const totalProfit = totalPortfolioValue - totalInvested

  return (
    <div className="space-y-6">
      {/* Dashboard Económico */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{economy.coins.toLocaleString()}</div>
              <div className="text-sm opacity-90">🪙 Monedas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{economy.gems.toLocaleString()}</div>
              <div className="text-sm opacity-90">💎 Gemas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{economy.premiumCoins.toLocaleString()}</div>
              <div className="text-sm opacity-90">👑 Premium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalPortfolioValue.toLocaleString()}</div>
              <div className="text-sm opacity-90">📈 Inversiones</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="marketplace" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="marketplace">🛒 Marketplace</TabsTrigger>
          <TabsTrigger value="portfolio">💼 Portafolio</TabsTrigger>
          <TabsTrigger value="investments">📊 Inversiones</TabsTrigger>
          <TabsTrigger value="bank">🏦 Banco</TabsTrigger>
          <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
        </TabsList>

        {/* Marketplace */}
        <TabsContent value="marketplace">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={marketFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setMarketFilter('all')}
                >
                  Todos
                </Button>
                {['pet', 'decoration', 'boost', 'premium', 'nft'].map(category => (
                  <Button
                    key={category}
                    size="sm"
                    variant={marketFilter === category ? 'default' : 'outline'}
                    onClick={() => setMarketFilter(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
                <option value="rarity">Rareza</option>
                <option value="demand">Demanda</option>
                <option value="trending">Tendencia</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const priceChange = item.priceHistory[item.priceHistory.length - 1] - 
                                   item.priceHistory[item.priceHistory.length - 2]
                const priceChangePercent = (priceChange / item.priceHistory[item.priceHistory.length - 2]) * 100

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      item.rarity === 'mythic' ? 'border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50' :
                      item.rarity === 'legendary' ? 'border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50' :
                      item.rarity === 'epic' ? 'border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-blue-50' :
                      ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-xs text-gray-600">{item.description}</p>
                          </div>
                          <Badge variant={
                            item.rarity === 'mythic' ? 'destructive' :
                            item.rarity === 'legendary' ? 'default' :
                            item.rarity === 'epic' ? 'secondary' : 'outline'
                          }>
                            {item.rarity}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Precio:</span>
                            <span className="font-semibold">
                              {item.price} {item.currency === 'coins' ? '🪙' : item.currency === 'gems' ? '💎' : '👑'}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Mercado:</span>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">{item.marketValue}</span>
                              <span className={`text-xs ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {priceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {Math.abs(priceChangePercent).toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">Demanda:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={item.demand} className="w-16 h-2" />
                              <span className="text-xs">{item.demand}%</span>
                            </div>
                          </div>

                          {item.limited && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Stock:</span>
                              <Badge variant="outline">{item.supply} restantes</Badge>
                            </div>
                          )}

                          <Button
                            onClick={() => setSelectedItem(item)}
                            className="w-full mt-2"
                            size="sm"
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Ver Detalles
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        {/* Portafolio */}
        <TabsContent value="portfolio">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {economy.ownedItems.length}
                  </div>
                  <div className="text-sm text-gray-600">Items Únicos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {economy.ownedItems.reduce((sum, item) => sum + (item.marketValue * item.owned), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Valor Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {economy.ownedItems.filter(item => item.rarity === 'legendary' || item.rarity === 'mythic').length}
                  </div>
                  <div className="text-sm text-gray-600">Items Raros</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {economy.ownedItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant="outline">x{item.owned}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Valor unitario:</span>
                        <span>{item.marketValue} {item.currency === 'coins' ? '🪙' : '💎'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Valor total:</span>
                        <span className="font-semibold">
                          {(item.marketValue * item.owned).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {item.tradeable && (
                      <Button
                        onClick={() => setSelectedItem(item)}
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                      >
                        Vender
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Inversiones */}
        <TabsContent value="investments">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Resumen de Inversiones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {totalInvested.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Invertido</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">
                      {totalPortfolioValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Valor Actual</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Ganancia</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {economy.investments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{investment.name}</h4>
                        <p className="text-sm text-gray-600">{investment.description}</p>
                        <div className="flex gap-4 text-xs mt-1">
                          <span>Invertido: {investment.invested.toLocaleString()}</span>
                          <span>Actual: {Math.floor(investment.currentValue).toLocaleString()}</span>
                          <span className={investment.currentValue > investment.invested ? 'text-green-600' : 'text-red-600'}>
                            {investment.currentValue > investment.invested ? '+' : ''}
                            {Math.floor(investment.currentValue - investment.invested)}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => withdrawInvestment(investment.id)}
                        size="sm"
                        variant="outline"
                      >
                        Retirar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Oportunidades de Inversión</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableInvestments.map((investment) => (
                    <Card key={investment.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{investment.name}</h4>
                          <Badge variant={
                            investment.risk === 'high' ? 'destructive' :
                            investment.risk === 'medium' ? 'default' : 'secondary'
                          }>
                            {investment.risk} riesgo
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{investment.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Retorno diario:</span>
                            <span className="font-semibold text-green-600">
                              {(investment.dailyReturn * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Tipo:</span>
                            <span>{investment.type}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Input
                            type="number"
                            placeholder="Cantidad"
                            className="text-sm"
                            min="100"
                            step="100"
                            onChange={(e) => {
                              const button = e.target.nextElementSibling as HTMLButtonElement
                              if (button) button.dataset.amount = e.target.value
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={(e) => {
                              const amount = parseInt((e.target as any).dataset.amount || '0')
                              if (amount >= 100) invest(investment, amount)
                            }}
                          >
                            Invertir
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Banco */}
        <TabsContent value="bank">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Banco Pou
                </CardTitle>
                <CardDescription>
                  Gestiona tus finanzas y obtén préstamos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{economy.bankBalance.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Saldo Banco</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{economy.creditScore}</div>
                    <div className="text-sm text-gray-600">Score Crediticio</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">{economy.dailyIncome.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Ingresos Diarios</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600">{economy.weeklySpending.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Gastos Semanales</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">🏦 Servicios Bancarios</h4>
                      <div className="space-y-2">
                        <Button className="w-full" variant="outline">
                          <PiggyBank className="h-4 w-4 mr-2" />
                          Abrir Cuenta de Ahorros (2% anual)
                        </Button>
                        <Button className="w-full" variant="outline">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Solicitar Tarjeta de Crédito
                        </Button>
                        <Button className="w-full" variant="outline">
                          <Calculator className="h-4 w-4 mr-2" />
                          Calculadora de Préstamos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">💳 Historial Crediticio</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Pagos a tiempo:</span>
                          <span className="text-green-600">98%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Utilización crédito:</span>
                          <span className="text-blue-600">25%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Historial:</span>
                          <span className="text-purple-600">2 años</span>
                        </div>
                        <Progress value={economy.creditScore / 10} className="mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Rendimiento del Portafolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600">Gráfico de rendimiento</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Distribución de Assets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Efectivo</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Inversiones</span>
                      <span className="font-semibold">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Items/NFTs</span>
                      <span className="font-semibold">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Transacciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {economy.marketHistory.slice(-10).reverse().map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          transaction.type === 'buy' ? 'bg-red-100 text-red-700' :
                          transaction.type === 'sell' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {transaction.type}
                        </span>
                        <span className="text-sm">
                          {transaction.itemId ? marketItems.find(i => i.id === transaction.itemId)?.name : 'Inversión'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {transaction.amount} {transaction.currency}
                        </div>
                        {transaction.profit !== undefined && (
                          <div className={`text-xs ${transaction.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.profit >= 0 ? '+' : ''}{transaction.profit}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Item */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {selectedItem.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{selectedItem.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Precio de mercado:</span>
                  <span className="font-semibold">
                    {selectedItem.marketValue} {selectedItem.currency === 'coins' ? '🪙' : '💎'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tu balance:</span>
                  <span>{getCurrencyBalance(selectedItem.currency).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span>Cantidad:</span>
                <Input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={selectedItem.limited ? selectedItem.supply : 99}
                  className="w-20"
                />
              </div>

              <div className="flex gap-2">
                {economy.ownedItems.find(item => item.id === selectedItem.id) ? (
                  <Button
                    onClick={() => sellItem(selectedItem)}
                    className="flex-1"
                    variant="destructive"
                  >
                    Vender por {Math.floor(selectedItem.marketValue * 0.85 * tradeAmount)}
                  </Button>
                ) : (
                  <Button
                    onClick={() => buyItem(selectedItem)}
                    className="flex-1"
                    disabled={getCurrencyBalance(selectedItem.currency) < selectedItem.price * tradeAmount}
                  >
                    Comprar por {selectedItem.price * tradeAmount}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}