import DashboardPage from "../../pages/dashboard/ui"
import { Route } from "wouter"

function App() {
	return (
		<>
			<Route path="/dashboard/:patientId/:appointmentId">
				<DashboardPage />
			</Route>
			
		</>
	)
}

export default App
