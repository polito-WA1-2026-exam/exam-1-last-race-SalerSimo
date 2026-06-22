
export function GameTitle() {
    return (
        <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-uppercase mb-2"
                style={{ letterSpacing: '0.05em', color: '#2c3e50' }}>
                Last Race
            </h1>
            <p className="text-muted" style={{ maxWidth: '480px', margin: '0 auto' }}>
                Navigate a fictional underground network, beat the clock, and reach
                your destination with as many coins as possible.
            </p>
        </div>
    );
}
