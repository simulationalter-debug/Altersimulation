import { useStore } from "./store";
import Landing from "./components/Landing";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";

function App() {
  const screen = useStore((s) => s.screen);

  return (
    <div className="min-h-screen bg-[#05050a] text-white">
      {screen === "landing" && <Landing />}
      {screen === "onboarding" && <Onboarding />}
      {screen === "dashboard" && <Dashboard />}
    </div>
  );
}

export default App;
