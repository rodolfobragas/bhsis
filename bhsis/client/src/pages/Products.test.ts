import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Products from "./Products";

// Mock the auth hook
vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "1", name: "Test User", role: "admin" },
    isAuthenticated: true,
    loading: false,
    error: null,
    logout: vi.fn(),
  }),
}));

// Mock the API service
vi.mock("@/services/api", () => ({
  default: {
    getProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

describe("Products Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders products page with header", () => {
    render(<Products />);

    expect(screen.getByText(/Gerenciamento de Produtos/i)).toBeInTheDocument();
    expect(screen.getByText(/Gerencie o catálogo de produtos/i)).toBeInTheDocument();
  });

  it("renders search bar", () => {
    render(<Products />);

    expect(screen.getByPlaceholderText(/Pesquise por nome, SKU ou categoria/i)).toBeInTheDocument();
  });

  it("renders product table", () => {
    render(<Products />);

    expect(screen.getByText(/Produtos/i)).toBeInTheDocument();
    expect(screen.getByText(/Novo Produto/i)).toBeInTheDocument();
  });

  it("displays mock products after loading", async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText("Marmita de Frango")).toBeInTheDocument();
      expect(screen.getByText("Marmita de Peixe")).toBeInTheDocument();
    });
  });

  it("filters products by search term", async () => {
    const user = userEvent.setup();
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText("Marmita de Frango")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Pesquise por nome, SKU ou categoria/i);
    await user.type(searchInput, "Frango");

    await waitFor(() => {
      expect(screen.getByText("Marmita de Frango")).toBeInTheDocument();
      expect(screen.queryByText("Refrigerante 2L")).not.toBeInTheDocument();
    });
  });

  it("opens dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    render(<Products />);

    const addButton = screen.getByText(/Novo Produto/i);
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Novo Produto/i)).toBeInTheDocument();
    });
  });

  it("displays product prices correctly", async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText("R$ 25.00")).toBeInTheDocument();
      expect(screen.getByText("R$ 32.00")).toBeInTheDocument();
    });
  });

  it("displays category badges", async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText("Marmitas")).toBeInTheDocument();
      expect(screen.getByText("Bebidas")).toBeInTheDocument();
    });
  });
});
