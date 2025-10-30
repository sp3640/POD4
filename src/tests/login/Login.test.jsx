// setupTests.js
import '@testing-library/jest-dom'

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { MemoryRouter } from "react-router-dom"
import Login from "../../components/auth/Login"

// Mock useAuth hook
vi.mock("../../hooks/auth/useAuth", () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe("Login Component", () => {
  let loginMock

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    loginMock = vi.fn()
    // Override the mocked useAuth to return our loginMock
    vi.doMock("../../hooks/auth/useAuth", () => ({
      useAuth: () => ({
        login: loginMock,
      }),
    }))
  })

  const renderLogin = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

  it("renders all form fields", () => {
    renderLogin()

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument()
  })

  it("updates input values", () => {
    renderLogin()

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const roleSelect = screen.getByLabelText(/Role/i)

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.change(passwordInput, { target: { value: "secret" } })
    fireEvent.change(roleSelect, { target: { value: "ADMIN" } })

    expect(emailInput.value).toBe("test@example.com")
    expect(passwordInput.value).toBe("secret")
    expect(roleSelect.value).toBe("ADMIN")
  })

  
})
