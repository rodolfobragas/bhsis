import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductTable from "./ProductTable";

describe("ProductTable", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnAdd = vi.fn();

  const mockProducts = [
    {
      id: "1",
      name: "Marmita de Frango",
      sku: "MARM-001",
      category: "Marmitas",
      price: 25.0,
      active: true,
    },
    {
      id: "2",
      name: "Refrigerante 2L",
      sku: "BEB-001",
      category: "Bebidas",
      price: 8.0,
      active: true,
    },
  ];

  it("renders product table with headers", () => {
    render(
      <ProductTable
        products={mockProducts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />
    );

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("SKU")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Preço")).toBeInTheDocument();
  });

  it("displays all products in table", () => {
    render(
      <ProductTable
        products={mockProducts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />
    );

    expect(screen.getByText("Marmita de Frango")).toBeInTheDocument();
    expect(screen.getByText("MARM-001")).toBeInTheDocument();
    expect(screen.getByText("Refrigerante 2L")).toBeInTheDocument();
    expect(screen.getByText("BEB-001")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    render(
      <ProductTable
        products={[]}
        isLoading={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />
    );

    expect(screen.getByText(/Carregando produtos/i)).toBeInTheDocument();
  });

  it("displays empty state when no products", () => {
    render(
      <ProductTable
        products={[]}
        isLoading={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />
    );

    expect(screen.getByText(/Nenhum produto encontrado/i)).toBeInTheDocument();
  });

  it("calls onAdd when add button is clicked", () => {
    render(
      <ProductTable
        products={mockProducts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />
    );

    const addButton = screen.getByText(/Novo Produto/i);
    fireEvent.click(addButton);

    expect(mockOnAdd).toHaveBeenCalled();
  });

  it("displays prices correctly formatted", () => {
    render(
      <ProductTable
        products={mockProducts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />
    );

    expect(screen.getByText("R$ 25.00")).toBeInTheDocument();
    expect(screen.getByText("R$ 8.00")).toBeInTheDocument();
  });

  it("displays category badges", () => {
    render(
      <ProductTable
        products={mockProducts}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onAdd={mockOnAdd}
      />
    );

    expect(screen.getByText("Marmitas")).toBeInTheDocument();
    expect(screen.getByText("Bebidas")).toBeInTheDocument();
  });
});
