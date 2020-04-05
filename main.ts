namespace kittenbit {

    // for Powerbrick initialization
    const SerialPort = [
        [SerialPin.P0, SerialPin.P8],   // Port1
        [SerialPin.P1, SerialPin.P12],  // Port2
        [SerialPin.P2, SerialPin.P13],  // Port3
        [SerialPin.P14, SerialPin.P15]  // Port4
    ]

    // for Powerbrick initialization
    export enum SerialPorts {
        Port1 = 0,
        Port2 = 1,
        Port3 = 2,
        Port4 = 3
    }

    let initialized = false

    /**
    * Set the serial input and output pins for the communication with the Rosbot baseboard
    * @param tx the transmission pin
    * @param rx the reception pin
    */
    //% weight=10
    //% blockId=rosbot_initialize block="Rosbot initialize|TX %tx|RX %rx"
    //% tx.fieldEditor="gridpicker" tx.fieldOptions.columns=3
    //% tx.fieldOptions.tooltips="false"
    //% tx.defl=SerialPin.P1
    //% rx.fieldEditor="gridpicker" rx.fieldOptions.columns=3
    //% rx.fieldOptions.tooltips="false"
    //% rx.defl=SerialPin.P2
    //% blockGap=8 inlineInputMode=inline
    //% group="Configuration"
    export function initialize(tx: SerialPin, rx: SerialPin) {
        serial.redirect(tx, rx, BaudRate.BaudRate115200)
        initialized = true
    }

    /**
    * Set the serial communication with the Rosbot baseboard from a Powerbrick port
    * @param port the Powerbrick communication port
    */
    //% weight=10
    //% blockId=rosbot_powerbrick_initialize block="Rosbot <-> Powerbrick initialize|Port %port"
    //% port.fieldEditor="gridpicker" tx.fieldOptions.columns=3
    //% port.fieldOptions.tooltips="false"
    //% port.defl=SerialPorts.Port1
    //% blockGap=8 inlineInputMode=inline
    //% group="Configuration"
    export function powerbrick_initialize(port: SerialPorts) {
        initialize(SerialPort[port][0], SerialPort[port][1])
    }

    /**
     * Only used internally to default to USB
     */
    function default_initialize() {
        serial.redirectToUSB()
        initialized = true
    }

    // Kitten:bit
    let PREFIX = "M"
    let FIRMWARE = "Kitten:bit V3.9\r\n"

    // Helper functions
    function trim(n: string): string {
        while (n.charCodeAt(n.length - 1) < 0x1f) {
            n = n.slice(0, n.length - 1)
        }
        return n;
    }

    serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
        let receivedCmd = serial.readUntil("\n")
        receivedCmd = trim(receivedCmd)
        if (receivedCmd.length < 1) {
            return;
        }
        commandprocessor.ProcessCommand(receivedCmd)
    })

    function selectMotor(motor: number): robotbit.Motors {
        switch (motor) {
            case 3:
                return robotbit.Motors.M2B;
            case 2:
                return robotbit.Motors.M2A;
            case 1:
                return robotbit.Motors.M1B;
            // case 0:
            default:
                return robotbit.Motors.M1A;
        }
    }

    // Commands
    function echoVersion() {
        serial.writeString(PREFIX + "0 " + FIRMWARE)
    }

    function notImplemented() {
        serial.writeString("ERR: Not implemented")
    }

    function MCommandProcessor(command: string) {
        let cmdArgs = command.split(" ")
        let cmdId = parseInt(cmdArgs[0])

        switch (cmdId) {
            case 0:       // echo version
                echoVersion()
                break;

            case 1: // set pin mode: M1 pin mode
                //doPinMode(tmp);
                notImplemented();
                break;

            case 2: // digital write: M2 pin level
                //doDigitalWrite(tmp);
                notImplemented();
                break;

            case 3: // digital read: M3 pin
                //doDigitalRead(tmp);
                notImplemented();
                break;

            case 4: // analog write: M4 pin pwm
                //doAnalogWrite(tmp);
                notImplemented();
                break;

            case 5: // analog read: M5 pin
                //doAnalogRead(tmp);
                notImplemented();
                break;

            case 6: // tone : M6 pin freq duration
                // TODO: pin is ignored (although 'all' should be possible)
                // needs mapping
                pins.analogSetPitchPin(AnalogPin.P0)
                pins.analogPitch(
                    parseInt(cmdArgs[2]),
                    parseInt(cmdArgs[3]))
                break;

            case 7: // servo : M7 pin degree
                // doServo(tmp);
                notImplemented();
                break;

            case 8: // read vin voltage
                //doEchoVin();
                notImplemented();
                break;

            case 9: // rgb led
                //doRgb(tmp);
                notImplemented();
                break;

            case 10: // button
                //doButton(tmp);
                notImplemented();
                break;

            case 11: // rgb brightness
                //doRgbBrightness(tmp);
                notImplemented();
                break;

            case 20:
                //doMatrixString(tmp);
                notImplemented();
                break;

            case 21:
                //doMatrixShow(tmp);
                notImplemented();
                break;

            case 22:
                //doMatrixRect(tmp);
                notImplemented();
                break;

            case 30:
                //doExtIO(tmp);
                notImplemented();
                break;

            case 31:
                //doExtIOSet(tmp);
                notImplemented();
                break;

            case 100: // single stepper movement
                //doStepperSingle(tmp);
                notImplemented();
                break;

            case 101: // move in distance
                //doStepperLine(tmp);
                notImplemented();
                break;

            case 102: // turn in degree
                //doStepperTurn(tmp);
                notImplemented();
                break;

            case 103: // draw arc
                //doStepperArc(tmp);
                notImplemented();
                break;

            case 104: // set ppm
                //doSetPPM(tmp);
                notImplemented();
                break;

            case 105: // set wheel base
                //doSetWheelBase(tmp);
                notImplemented();
                break;

            case 200:
                robotbit.MotorRun(
                    selectMotor(parseInt(cmdArgs[1])),
                    parseInt(cmdArgs[2]));
                break;

            case 201:
                //doCarMove(tmp);
                notImplemented();
                break;

            case 203: // stop motors
                robotbit.MotorStopAll()
                break;

            case 204:     // motor: dual
                robotbit.MotorRunDual(robotbit.Motors.M1A,
                    parseInt(cmdArgs[1]),
                    robotbit.Motors.M1B,
                    parseInt(cmdArgs[2]));
                let duration = parseInt(cmdArgs[3])
                if (duration > 0) {
                    basic.pause(duration)
                    robotbit.MotorStop(robotbit.Motors.M1A);
                    robotbit.MotorStop(robotbit.Motors.M1B);
                }
                break;

            case 205:
                robotbit.MotorRunDual(robotbit.Motors.M1A,
                    parseInt(cmdArgs[1]),
                    robotbit.Motors.M1B,
                    parseInt(cmdArgs[2]));
                robotbit.MotorRunDual(robotbit.Motors.M2A,
                    parseInt(cmdArgs[3]),
                    robotbit.Motors.M2B,
                    parseInt(cmdArgs[4]));
                break;

            case 209:
                //doOmniWheel(tmp);
                notImplemented();
                break;

            case 212: // servo array
                //doServoArray(tmp);
                notImplemented();
                break;

            case 213: // geek servo array
                //doGeekServoArray(tmp);
                notImplemented();
                break;

            case 220:
                //doPS2Init();
                notImplemented();
                break;

            case 221:
                //doPS2Axis(tmp);
                notImplemented();
                break;

            case 222:
                //doPS2Button(tmp);
                notImplemented();
                break;

            case 250:
                //doPing(tmp);
                notImplemented();
                break;

            case 999:     // perform device reset
                control.reset()
                break;

            default:
                // Ignored by kittenblock
                serial.writeString(PREFIX + cmdId + " -1")
        }
    }

    // Start
    commandprocessor.SetProcessor(PREFIX, MCommandProcessor)
    commandprocessor.ProcessCommand(PREFIX + "0")
    default_initialize()
}