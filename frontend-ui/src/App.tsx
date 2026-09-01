import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TaskReviewPage } from "./pages/TaskReviewPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TaskReviewPage />
    </QueryClientProvider>
  );
}

export default App;
