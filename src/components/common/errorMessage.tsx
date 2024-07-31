function parseErrors(errorString: string) {
    // Initialize the error object with undefined values
    const errors: { [key: string]: string | undefined } = {
        emailError: undefined,
        timezoneError: undefined,
        dateError: undefined,
        timeSlotError: undefined,
    }

    // Split the error string into individual messages based on periods
    const messages = errorString
        .split(/\. +/)
        .map((msg) => msg.trim())
        .filter((msg) => msg.length > 0)

    // Iterate over each message and assign it based on the keyword
    messages.forEach((message) => {
        switch (true) {
            case /email/.test(message):
                errors.emailError = message
                break
            case /time zone/.test(message):
                errors.timezoneError = message
                break
            case /appointment date/.test(message):
                errors.dateError = message
                break
            case /time slot/.test(message):
                errors.timeSlotError = message
                break
        }
    })

    return errors
}

export default parseErrors
