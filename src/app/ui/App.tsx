import DashboardPage from "../../pages/dashboard/ui"
import { Route } from "wouter"
import { Buffer } from "buffer"

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
