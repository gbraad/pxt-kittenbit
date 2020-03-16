namespace kittenbit {

    // Constants and global variables
    const FIRMWARE = "Kitten:bit V3.9\r\n"

    // Configuration
    serial.redirect(SerialPin.P0, SerialPin.P1, 115200)

    // Extensions
    let xCommandProcessor

    function processMCommand(cmd: string) {
        let elem = helpers.stringSplit(cmd, " ")
        switch (elem[0]) {
            case "0":       // firmware version
                echoVersion()
                break;
            case "999":     // perform device reset
                control.reset()
                break;
            case "204":     // motor: dual, no duration
                robotbit.MotorRunDual(robotbit.Motors.M1A,
                    parseInt(elem[1]),
                    robotbit.Motors.M1B,
                    parseInt(elem[2]));
                break;
            default:
                serial.writeString("M" + elem[0] + " -1")
        }
    }

    serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
        let receivedCmd = serial.readLine()
        if (receivedCmd.length < 1) {
            return;
        }

        let cmdCode = receivedCmd.slice(0, 1)
        let cmdParams = receivedCmd.slice(1, receivedCmd.length)

        switch(cmdCode) {
            case "M":
                // Process M-kittenbot commands
                processMCommand(cmdParams)
                break
            case "X":
                // TODO
                break
            default:
                // Invalid command
                break
        }
    })

    // Commands

    function echoVersion() {
        serial.writeString("M0 " + FIRMWARE)
    }

    // Start
    echoVersion()

}