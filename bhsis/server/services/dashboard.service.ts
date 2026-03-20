import prisma from "../config/database";
import { OrderStatus, Prisma } from "@prisma/client";

type OrdersByDayRow = { label: string; orders: number; revenue: number };
type OrdersByHourRow = { hour: number; orders: number };
type OrdersByWeekRow = { weekStart: string; orders: number; revenue: number };
type OrdersByMonthRow = { monthStart: string; orders: number; revenue: number };
type TopProductRow = { name: string; quantity: number; revenue: number };
type TopCustomerRow = { id: string; name: string; orders: number; revenue: number };
type StockReportRow = { id: string; name: string; quantity: number; minQuantity: number };

export class DashboardService {
  async getSummary(filters?: { startDate?: string; endDate?: string; category?: string }) {
    const startDate = filters?.startDate ? new Date(filters.startDate) : null;
    const endDate = filters?.endDate ? new Date(filters.endDate) : null;
    const endExclusive = endDate
      ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
      : null;

    const orderFilters: Prisma.Sql[] = [];
    if (startDate) {
      orderFilters.push(Prisma.sql`o."createdAt" >= ${startDate}`);
    }
    if (endExclusive) {
      orderFilters.push(Prisma.sql`o."createdAt" < ${endExclusive}`);
    }
    if (filters?.category) {
      orderFilters.push(
        Prisma.sql`EXISTS (
          SELECT 1
          FROM "OrderItem" oi
          JOIN "Product" p ON p.id = oi."productId"
          WHERE oi."orderId" = o.id
            AND p.category = ${filters.category}
        )`,
      );
    }

    const buildWhere = (extra: Prisma.Sql[] = []) => {
      const clauses = [...orderFilters, ...extra];
      return clauses.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(clauses, " AND ")}`
        : Prisma.sql``;
    };

    const dayStart =
      startDate ?? new Date(new Date().setDate(new Date().getDate() - 6));
    const dayEnd = endDate ?? new Date();

    const weekStart = new Date(dayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const weekEnd = new Date(dayEnd);
    weekEnd.setDate(weekEnd.getDate() - weekEnd.getDay());

    const monthStart = new Date(dayStart.getFullYear(), dayStart.getMonth(), 1);
    const monthEnd = new Date(dayEnd.getFullYear(), dayEnd.getMonth(), 1);

    const hourBase = endDate ?? new Date();
    const hourStart = new Date(hourBase);
    hourStart.setHours(0, 0, 0, 0);
    const hourEnd = new Date(hourStart.getTime() + 24 * 60 * 60 * 1000);

    const [
      totalOrdersRaw,
      deliveredOrdersRaw,
      totalCustomers,
      totalProducts,
      lowStockItemsRaw,
      totalRevenueRaw,
      avgPrepTimeRaw,
      ordersByDayRaw,
      ordersByHourRaw,
      ordersByWeekRaw,
      ordersByMonthRaw,
      topProductsRaw,
      inProgressOrdersRaw,
      outOfStockItemsRaw,
      topCustomersRaw,
      categoriesRaw,
      lowStockProductsRaw,
      outOfStockProductsRaw,
    ] = await Promise.all([
      prisma.$queryRaw<{ count: string | number }[]>`
        SELECT COUNT(*) AS count
        FROM "Order" o
        ${buildWhere()}
      `,
      prisma.$queryRaw<{ count: string | number }[]>`
        SELECT COUNT(*) AS count
        FROM "Order" o
        ${buildWhere([Prisma.sql`o."status" = ${OrderStatus.DELIVERED}`])}
      `,
      prisma.customer.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.$queryRaw<{ count: string | number }[]>`
        SELECT COUNT(*) AS count
        FROM "InventoryItem"
        WHERE quantity < "minQuantity"
      `,
      prisma.$queryRaw<{ total: string | number | null }[]>`
        SELECT COALESCE(SUM(o.total), 0) AS total
        FROM "Order" o
        ${buildWhere([Prisma.sql`o."status" = ${OrderStatus.DELIVERED}`])}
      `,
      prisma.$queryRaw<{ avg_seconds: string | number | null }[]>`
        SELECT EXTRACT(EPOCH FROM AVG(o."completedAt" - o."createdAt")) AS avg_seconds
        FROM "Order" o
        ${buildWhere([
          Prisma.sql`o."completedAt" IS NOT NULL`,
          Prisma.sql`o."status" = ${OrderStatus.DELIVERED}`,
        ])}
      `,
      prisma.$queryRaw<
        { label: string; orders: string | number; revenue: string | number }[]
      >`
        SELECT
          TO_CHAR(day, 'DD/MM') AS label,
          COALESCE(COUNT(o.id), 0) AS orders,
          COALESCE(SUM(o.total), 0) AS revenue
        FROM generate_series(${dayStart}::date, ${dayEnd}::date, interval '1 day') day
        LEFT JOIN "Order" o
          ON date_trunc('day', o."createdAt") = day
          ${filters?.category ? Prisma.sql`AND EXISTS (
            SELECT 1 FROM "OrderItem" oi
            JOIN "Product" p ON p.id = oi."productId"
            WHERE oi."orderId" = o.id
              AND p.category = ${filters.category}
          )` : Prisma.sql``}
        GROUP BY day
        ORDER BY day
      `,
      prisma.$queryRaw<{ hour: number; orders: string | number }[]>`
        SELECT
          h.hour AS hour,
          COALESCE(COUNT(o.id), 0) AS orders
        FROM generate_series(0, 23) AS h(hour)
        LEFT JOIN "Order" o
          ON EXTRACT(HOUR FROM o."createdAt") = h.hour
         AND o."createdAt" >= ${hourStart}
         AND o."createdAt" < ${hourEnd}
         ${filters?.category ? Prisma.sql`AND EXISTS (
            SELECT 1 FROM "OrderItem" oi
            JOIN "Product" p ON p.id = oi."productId"
            WHERE oi."orderId" = o.id
              AND p.category = ${filters.category}
          )` : Prisma.sql``}
        GROUP BY h.hour
        ORDER BY h.hour
      `,
      prisma.$queryRaw<{ week_start: Date; orders: string | number; revenue: string | number }[]>`
        SELECT
          week_start,
          COALESCE(COUNT(o.id), 0) AS orders,
          COALESCE(SUM(o.total), 0) AS revenue
        FROM generate_series(
          date_trunc('week', ${weekStart}::date),
          date_trunc('week', ${weekEnd}::date),
          interval '1 week'
        ) AS week_start
        LEFT JOIN "Order" o
          ON date_trunc('week', o."createdAt") = week_start
          ${filters?.category ? Prisma.sql`AND EXISTS (
            SELECT 1 FROM "OrderItem" oi
            JOIN "Product" p ON p.id = oi."productId"
            WHERE oi."orderId" = o.id
              AND p.category = ${filters.category}
          )` : Prisma.sql``}
        GROUP BY week_start
        ORDER BY week_start
      `,
      prisma.$queryRaw<{ month_start: Date; orders: string | number; revenue: string | number }[]>`
        SELECT
          month_start,
          COALESCE(COUNT(o.id), 0) AS orders,
          COALESCE(SUM(o.total), 0) AS revenue
        FROM generate_series(
          date_trunc('month', ${monthStart}::date),
          date_trunc('month', ${monthEnd}::date),
          interval '1 month'
        ) AS month_start
        LEFT JOIN "Order" o
          ON date_trunc('month', o."createdAt") = month_start
          ${filters?.category ? Prisma.sql`AND EXISTS (
            SELECT 1 FROM "OrderItem" oi
            JOIN "Product" p ON p.id = oi."productId"
            WHERE oi."orderId" = o.id
              AND p.category = ${filters.category}
          )` : Prisma.sql``}
        GROUP BY month_start
        ORDER BY month_start
      `,
      prisma.$queryRaw<
        { name: string; quantity: string | number; revenue: string | number }[]
      >`
        SELECT
          p.name AS name,
          COALESCE(SUM(oi.quantity), 0) AS quantity,
          COALESCE(SUM(oi.total), 0) AS revenue
        FROM "Product" p
        LEFT JOIN "OrderItem" oi
          ON oi."productId" = p.id
        LEFT JOIN "Order" o
          ON o.id = oi."orderId"
        ${buildWhere()}
        ${filters?.category ? Prisma.sql`AND p.category = ${filters.category}` : Prisma.sql``}
        GROUP BY p.name
        ORDER BY quantity DESC
        LIMIT 10
      `,
      prisma.$queryRaw<{ count: string | number }[]>`
        SELECT COUNT(*) AS count
        FROM "Order" o
        ${buildWhere([
          Prisma.sql`o."status" IN (${Prisma.join(
            [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY],
            ", ",
          )})`,
        ])}
      `,
      prisma.$queryRaw<{ count: string | number }[]>`
        SELECT COUNT(*) AS count
        FROM "InventoryItem"
        WHERE quantity <= 0
      `,
      prisma.$queryRaw<
        { id: string; name: string; orders: string | number; revenue: string | number }[]
      >`
        SELECT
          c.id AS id,
          c.name AS name,
          COUNT(o.id) AS orders,
          COALESCE(SUM(o.total), 0) AS revenue
        FROM "Customer" c
        LEFT JOIN "Order" o
          ON o."customerId" = c.id
        ${buildWhere()}
        GROUP BY c.id
        ORDER BY orders DESC
        LIMIT 5
      `,
      prisma.$queryRaw<{ category: string }[]>`
        SELECT DISTINCT category
        FROM "Product"
        ORDER BY category
      `,
      prisma.$queryRaw<{ id: string; name: string; quantity: string | number; min_quantity: string | number }[]>`
        SELECT
          p.id AS id,
          p.name AS name,
          i.quantity AS quantity,
          i."minQuantity" AS min_quantity
        FROM "InventoryItem" i
        JOIN "Product" p ON p.id = i."productId"
        WHERE i.quantity < i."minQuantity"
        ORDER BY i.quantity ASC
        LIMIT 20
      `,
      prisma.$queryRaw<{ id: string; name: string; quantity: string | number; min_quantity: string | number }[]>`
        SELECT
          p.id AS id,
          p.name AS name,
          i.quantity AS quantity,
          i."minQuantity" AS min_quantity
        FROM "InventoryItem" i
        JOIN "Product" p ON p.id = i."productId"
        WHERE i.quantity <= 0
        ORDER BY i.quantity ASC
        LIMIT 20
      `,
    ]);

    const totalOrders = Number(totalOrdersRaw?.[0]?.count ?? 0);
    const deliveredOrders = Number(deliveredOrdersRaw?.[0]?.count ?? 0);
    const totalRevenue = Number(totalRevenueRaw?.[0]?.total ?? 0);
    const avgPrepTimeSeconds = Number(avgPrepTimeRaw?.[0]?.avg_seconds ?? 0);
    const lowStockItems = Number(lowStockItemsRaw?.[0]?.count ?? 0);
    const inProgressOrders = Number(inProgressOrdersRaw?.[0]?.count ?? 0);
    const outOfStockItems = Number(outOfStockItemsRaw?.[0]?.count ?? 0);
    const ticketAverage = deliveredOrders > 0 ? totalRevenue / deliveredOrders : 0;
    const conversionRate = totalOrders > 0 ? deliveredOrders / totalOrders : 0;
    const kitchenLoadRate =
      totalOrders > 0 ? Math.min(1, inProgressOrders / totalOrders) : 0;

    const ordersByDay: OrdersByDayRow[] = ordersByDayRaw.map((row) => ({
      label: String(row.label).trim(),
      orders: Number(row.orders),
      revenue: Number(row.revenue),
    }));

    const ordersByHour: OrdersByHourRow[] = ordersByHourRaw.map((row) => ({
      hour: Number(row.hour),
      orders: Number(row.orders),
    }));

    const ordersByWeek: OrdersByWeekRow[] = ordersByWeekRaw.map((row) => ({
      weekStart: row.week_start.toISOString().slice(0, 10),
      orders: Number(row.orders),
      revenue: Number(row.revenue),
    }));

    const ordersByMonth: OrdersByMonthRow[] = ordersByMonthRaw.map((row) => ({
      monthStart: row.month_start.toISOString().slice(0, 10),
      orders: Number(row.orders),
      revenue: Number(row.revenue),
    }));

    const topProducts: TopProductRow[] = topProductsRaw.map((row) => ({
      name: row.name,
      quantity: Number(row.quantity),
      revenue: Number(row.revenue),
    }));

    const topCustomers: TopCustomerRow[] = topCustomersRaw.map((row) => ({
      id: row.id,
      name: row.name,
      orders: Number(row.orders),
      revenue: Number(row.revenue),
    }));

    const lowStockProducts: StockReportRow[] = lowStockProductsRaw.map((row) => ({
      id: row.id,
      name: row.name,
      quantity: Number(row.quantity),
      minQuantity: Number(row.min_quantity),
    }));

    const outOfStockProducts: StockReportRow[] = outOfStockProductsRaw.map((row) => ({
      id: row.id,
      name: row.name,
      quantity: Number(row.quantity),
      minQuantity: Number(row.min_quantity),
    }));

    const peakHours = [...ordersByHour]
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 3)
      .map((row) => row.hour);

    return {
      totals: {
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalProducts,
        lowStockItems,
        avgPrepTimeSeconds,
        ticketAverage,
        conversionRate,
      },
      ordersByDay,
      ordersByHour,
      ordersByWeek,
      ordersByMonth,
      topProducts,
      analytics: {
        inProgressOrders,
        kitchenLoadRate,
        outOfStockItems,
        topCustomers,
        peakHours,
      },
      reports: {
        stock: {
          lowStockProducts,
          outOfStockProducts,
        },
        customers: topCustomers,
        kitchen: {
          avgPrepTimeSeconds,
          inProgressOrders,
          kitchenLoadRate,
        },
      },
      categories: categoriesRaw.map((row) => row.category),
    };
  }
}

export default new DashboardService();
