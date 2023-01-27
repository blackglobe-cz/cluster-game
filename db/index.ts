import lib, {CommandType} from './lib.js'

const method = process.argv[2]

if (!(method in lib)) {
    console.log(`invalid method specified - ${method}`)
    process.exit(1)
}

lib[method as CommandType]({info: console.log, debug: console.log, error: console.error})
    .then(() => {
        console.log('Setup complete')
        process.exit(0)
    })
    .catch((err: any) => {
        console.error(err)
        process.exit(2)
    })