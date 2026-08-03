import PageHeader from "../../../shared/ui/PageHeader";
import { useDashboard } from "../hooks/useDashboard";
import FilterBar from "../components/FilterBar";
import SummaryCards from "../components/SummaryCards";
import ExpensesByCategory from "../components/ExpensesByCategory";
import IncomeByCategory from "../components/IncomeByCategory";
import TopSubcategories from "../components/TopSubcategories";
import ByAccount from "../components/ByAccount";
import MonthlyTrend from "../components/MonthlyTrend";
import AccountBalance from "../components/AccountBalance";

export default function DashboardPage() {
  const {
    accounts,
    categories,
    appliedFilters,
    setAppliedFilters,
    hasFilters,
    isFetching,
    reportCurrency,
    totalIncome,
    totalExpense,
    expenseByCat,
    incomeByCat,
    expenseBySubcat,
    incomeBySubcat,
    byAccount,
    byMonth,
  } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Resumen de tus finanzas" />

      <FilterBar
        accounts={accounts}
        categories={categories}
        onApply={setAppliedFilters}
      />

      <div className="space-y-4">
        {hasFilters && !isFetching && (
          <>
            <SummaryCards
              income={totalIncome}
              expense={totalExpense}
              currency={reportCurrency}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ExpensesByCategory
                data={expenseByCat}
                currency={reportCurrency}
              />
              <IncomeByCategory
                data={incomeByCat}
                currency={reportCurrency}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TopSubcategories
                data={expenseBySubcat}
                currency={reportCurrency}
                variant="expense"
              />
              <TopSubcategories
                data={incomeBySubcat}
                currency={reportCurrency}
                variant="income"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ByAccount
                data={byAccount}
                currency={reportCurrency}
              />
              <MonthlyTrend
                data={byMonth}
                currency={reportCurrency}
              />
            </div>

            <AccountBalance
              accounts={accounts}
              currency={reportCurrency}
              exchangeRate={appliedFilters.exchangeRate}
            />
          </>
        )}

        {hasFilters && isFetching && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border-2 border-zinc-100 bg-white p-4 animate-pulse"
                >
                  <div className="h-3 w-20 rounded bg-zinc-100 mb-2" />
                  <div className="h-5 w-28 rounded bg-zinc-100" />
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasFilters && (
          <div className="rounded-xl border-2 border-dashed border-zinc-200 py-16 text-center">
            <p className="text-zinc-400">
              Aplica filtros para ver los reportes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
