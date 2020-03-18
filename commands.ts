namespace commands {

    // Commands
    function echoVersion() {
        serial.writeString("M0 " + kittenbit.FIRMWARE)
    }

    export function MCommandProcessor(command: string) {
        let cmdArgs = helpers.stringSplit(command, " ")
        let cmdId = parseInt(cmdArgs[0])

        switch (cmdId) {
            case 0:       // firmware version
                echoVersion()
                break;

            case 999:     // perform device reset
                control.reset()
                break;

            case 204:     // motor: dual, no duration
                robotbit.MotorRunDual(robotbit.Motors.M1A,
                    parseInt(cmdArgs[1]),
                    robotbit.Motors.M1B,
                    parseInt(cmdArgs[2]));
                break;
            
            default:
                // Ignored by kittenblock
                serial.writeString("M" + cmdId + " -1")
        }
    }

}