import React from "react"


function TimerDisplay({timeData, pageState, formatTime}){
    return(
        <div style={{display: pageState.showSession ? "block" : "none"}}>
            <div className="row mb-2">
                <div className="col">
                    <h2 data-testid="session-title">{pageState.sessionTitle}</h2>
                        <p className="lead" data-testid="session-sub-title">
                            {formatTime(timeData.currentRemaining)} remaining
                        </p>
                </div>
            </div>
            <div className="row mb-2">
                <div className="col">
                    <div 
                    className="progress-bar"
                    role="progressbar"
                    aria-valuein="0"
                    aria-valuemax="100"
                    aria-valuenow={timeData.ariaRemaining * 100}
                    style={{width: `${timeData.ariaRemaining * 100}%`}}
                    />
                </div>
            </div>
        </div>
    )
}

export default TimerDisplay

