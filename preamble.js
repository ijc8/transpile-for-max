var self = this

function setTimeout(task, timeout) {
    var allowExecution = false
    var tsk = new Task(function () {
        if (allowExecution) {
            task()
            tsk.cancel()
        }
        allowExecution = true
    })

    tsk.interval = timeout
    tsk.repeat(2)
}
