import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import TimeControls from "./TimeControls"
import TimeDisplay from "./TimeDisplay"
import ModifyTime from "./ModifyTime"

function Pomodoro() {
  const initialTimeState={
    focusDuration: 1500,
    breakDuration: 300,
    focusRemaining: 1500,
    breakRemaining: 300,
    currentRemaining: 1500,
    ariaRemaining: 0,
  }
  const initialVisibleElementStates = {
    showSession: false,
    sessionTitle: "Focusing for 25:00 minutes",
  }

  const initialButtonStates = {
    modifyDurationButtonsDisabled: false,
    playButtonDisabled: false,
    stopButtonDisabled: true,
  }

  const activeButtonStates = {
    modifyDurationButtonsDisabled: true,
    playButtonDisabled: false,
    stopButtonDisabled: false,
  }

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [buttonState, setButtonStates] = useState(initialButtonStates)
  const [timeData, setTimeData] = useState(initialTimeState)
  const [pageState, setPageState] = useState(initialVisibleElementStates)

  const stop = () => {
    setIsTimerRunning(false)
    setTimeData(initialTimeState)
    setPageState(initialVisibleElementStates)
    setButtonStates(initialButtonStates)}

  const formatTime = (seconds) => {
    let formattedSeconds = parseInt(seconds, 10)
    let mm = Math.floor(formattedSeconds / 60)
    let ss = (formattedSeconds - mm * 60)
    if (mm < 10 && ss < 10) {
      return `0${mm}:0${ss}`
    } else if (mm < 10 && ss > 9 ) {
      return `0${mm}:${ss}`
    } else if (mm > 9 && ss < 10) {
      return `${mm}:0${ss}`
    } else if (mm > 9 && ss > 9) {
      return `${mm}:${ss}`
    }
  }

  useInterval(
    () => {
      // ToDo: Implement what should happen when the timer is running
      if(timeData.focusRemaining > 0) {
        pageState.sessionTitle = `Focusing for ${formatTime(timeData.focusDuration)} minutes`
        console.log(timeData.currentRemaining)
        timeData.currentRemaining = timeData.currentRemaining - 1
        timeData.focusRemaining = timeData.currentRemaining
        timeData.ariaRemaining = 1 - timeData.currentRemaining / timeData.focusDuration
        if (timeData.focusRemaining === 0){
          new Audio(`https://bigsoundbank.com/UPLOAD/mp3/1482.mp3`).play()
          timeData.currentRemaining = timeData.breakDuration
          timeData.ariaRemaining = 0
        }
      }
      if(timeData.focusRemaining === 0 & timeData.breakRemaining > 0) {
        pageState.sessionTitle = `On Break for ${formatTime(timeData.breakDuration)} minutes`
        console.log(timeData.currentRemaining)
        timeData.currentRemaining = timeData.currentRemaining - 1
        timeData.breakRemaining = timeData.currentRemaining
        timeData.ariaRemaining = 1 - timeData.currentRemaining / timeData.breakDuration
        if (timeData.breakRemaining === 0){
          new Audio(`https://bigsoundbank.com/UPLOAD/mp3/1110.mp3`).play()
          timeData.focusRemaining = timeData.focusDuration
          timeData.breakRemaining = timeData.breakDuration
          timeData.currentRemaining = timeData.focusDuration
        }
      }
      setTimeData({...timeData})
    },
    isTimerRunning ? 1000 : null
  );

  const modifyDuration = ({target}) => {
    if(target.name === "decrease-focus" && timeData.focusDuration > 300 && timeData.focusDuration <= 3600){
      timeData.focusDuration = timeData.focusDuration - 300
      timeData.focusRemaining = timeData.focusDuration
      timeData.currentRemaining = timeData.focusDuration
      pageState.sessionTitle = `Focusing for ${formatTime(timeData.focusDuration)} minutes`
      setPageState({...pageState})
      setTimeData({...timeData})
    }
    else if(target.name === "increase-focus" && timeData.focusDuration >= 300 && timeData.focusDuration < 3600){
      timeData.focusDuration = timeData.focusDuration + 300
      timeData.focusRemaining = timeData.focusDuration
      timeData.currentRemaining = timeData.focusDuration
      pageState.sessionTitle = `Focusing for ${formatTime(timeData.focusDuration)} minutes`
      setPageState({...pageState})
      setTimeData({...timeData})
    }
    else if(target.name === "decrease-break" && timeData.breakDuration > 60 && timeData.breakDuration <= 900){
      timeData.breakDuration = timeData.breakDuration - 60
      timeData.breakRemaining = timeData.breakDuration
      setPageState({...pageState})
      setTimeData({...timeData})
    }
    else if(target.name === "increase-break" && timeData.breakDuration >= 60 && timeData.breakDuration < 900){
      timeData.breakDuration = timeData.breakDuration + 60
      timeData.breakRemaining = timeData.breakDuration
      setPageState({...pageState})
      setTimeData({...timeData})
    }
  }

  function playPause() {
    setIsTimerRunning((prevState) => !prevState);
    pageState.showSession = true
    setPageState({...pageState})
    setButtonStates(activeButtonStates)
  }

  return (
    <div className="pomodoro">
      <ModifyTime timeData={timeData} buttonState={buttonState} formatTime={formatTime} modifyDuration={modifyDuration} />
      <TimeControls buttonState={buttonState} playPause={playPause} stop={stop} isTimerRunning={isTimerRunning} />
      <TimeDisplay timeData={timeData} pageState={pageState} formatTime={formatTime} />
    </div>
  );
}

export default Pomodoro;
