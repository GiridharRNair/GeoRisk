import { useState } from "react";

const mapBoxAPIKey = "pk.eyJ1Ijoidmlld3Nmcm9tdGhlNml4IiwiYSI6ImNtM2FnNHBlMjFnMjIybXB6dXV5eGpvOG4ifQ.pHD9qGKe5uE26mYuHM4r2g";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <h1>Vite + React</h1>
            <div>
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p>Click on the Vite and React logos to learn more</p>
        </>
    );
}

export default App;
