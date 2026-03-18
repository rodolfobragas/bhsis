import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "./ProductForm";

describe("ProductForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const categories = ["Marmitas", "Bebidas", "Sobremesas"];

  it("renders form fields correctly", () => {
    render(
      <ProductForm
        categories={categories}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/Nome do Produto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/SKU/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
  });

  it("displays validation errors for empty required fields", async () => {
    render(
      <ProductForm
        categories={categories}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByText(/Criar Produto/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/SKU é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/Categoria é obrigatória/i)).toBeInTheDocument();
    });
  });

  it("calls onSubmit with correct data when form is valid", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ProductForm
        categories={categories}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await user.type(screen.getByPlaceholderText(/Ex: Marmita de Frango/i), "Marmita de Frango");
    await user.type(screen.getByPlaceholderText(/Ex: MARM-001/i), "MARM-001");
    await user.type(screen.getByPlaceholderText(/0.00/i), "25.00");

    const submitButton = screen.getByText(/Criar Produto/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ProductForm
        categories={categories}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText(/Cancelar/i);
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("displays product data when editing", () => {
    const product = {
      id: "1",
      name: "Marmita de Frango",
      sku: "MARM-001",
      category: "Marmitas",
      price: 25.0,
      description: "Frango com arroz",
    };

    render(
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue("Marmita de Frango")).toBeInTheDocument();
    expect(screen.getByDisplayValue("MARM-001")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
  });
});
