// setupTests.js
import '@testing-library/jest-dom'

import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import AuctionCreateForm from "../../components/auction/AuctionCreateForm"
import AuthProvider from "../../hooks/auth/AuthProvider"
import { AuctionProvider } from "../../hooks/auction/useAuctions"

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <AuctionProvider>
        {ui}
      </AuctionProvider>
    </AuthProvider>
  )
}

describe("AuctionCreateForm", () => {
 it("renders all required fields", () => {
  renderWithProviders(<AuctionCreateForm onSuccess={() => {}} />)

  expect(screen.getByLabelText(/Auction Title/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Category/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Starting Price/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Auction Duration/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Item Condition/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
})

})


