type FetchParameters = Parameters<typeof fetch>
export function request(input: FetchParameters['0'], init: FetchParameters['1']) {
    return fetch(input, init).then(res => {
        console.log(res.body)
        const stream = res.body
        if (stream) {
            const reader = stream.getReader()
            reader.read().then(res => {
                console.log("read", res)
            })
        }
    })
}