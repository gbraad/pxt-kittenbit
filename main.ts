namespace kittenbit {
    // Configuration
    serial.redirect(SerialPin.P0, SerialPin.P1, 115200)

    // Extension
    type KittenBitProcessor = (cmd: string) => void

    let processMCommand: KittenBitProcessor

    let processXCommand: KittenBitProcessor
    export function setExtension(processor: KittenBitProcessor) {
        processXCommand = processor
    }

    serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
        let receivedCmd = serial.readLine()
        if (receivedCmd.length < 1) {
            return;
        }

        processCommand(receivedCmd)
    })

    function processCommand(command : string) {
        let cmdCode = command.slice(0, 1)
        let cmdParams = command.slice(1, command.length)

        switch (cmdCode) {
            case "M":
                // Process M-kittenbot commands
                processMCommand(cmdParams)
                break
            case "X":
                // Process eXtension commands
                processXCommand(cmdParams)
                break
            default:
                // Invalid command
                break
        }
    }

    // Start
    processMCommand = commands.MCommandProcessor
    processCommand("M0")    //echoVersion()
}