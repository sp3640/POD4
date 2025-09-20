import { useCallback, useRef } from 'react'

export const useWebSocket = () => {
  const ws = useRef(null)
  const subscriptions = useRef(new Map())



  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close()
      ws.current = null
    }
    subscriptions.current.clear()
  }, [])

  const subscribeToBids = useCallback((auctionId, callback) => {
    if (!ws.current) {
      console.error('WebSocket not connected')
      return
    }

    const callbacks = subscriptions.current.get(auctionId) || []
    subscriptions.current.set(auctionId, [...callbacks, callback])

    // Send subscription message
    ws.current.send(JSON.stringify({
      type: 'SUBSCRIBE',
      auctionId
    }))
  }, [])

  const unsubscribeFromBids = useCallback((auctionId) => {
    subscriptions.current.delete(auctionId)

    if (ws.current) {
      ws.current.send(JSON.stringify({
        type: 'UNSUBSCRIBE',
        auctionId
      }))
    }
  }, [])

  const sendBid = useCallback((auctionId, amount) => {
    if (!ws.current) {
      console.error('WebSocket not connected')
      return
    }

    ws.current.send(JSON.stringify({
      type: 'PLACE_BID',
      auctionId,
      amount
    }))
  }, [])
  const connect = useCallback((url) => {
    if (ws.current) {
      disconnect()
    }

    ws.current = new WebSocket(url)

    ws.current.onopen = () => {
      console.log('WebSocket connected')
    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'BID_UPDATE') {
          const callbacks = subscriptions.current.get(data.auctionId) || []
          callbacks.forEach(callback => callback(data))
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.current.onclose = () => {
      console.log('WebSocket disconnected')
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }, [disconnect])
  return {
    connect,
    disconnect,
    subscribeToBids,
    unsubscribeFromBids,
    sendBid,
    isConnected: !!ws.current
  }
}