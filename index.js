const knex = require('knex')
const { entity, field } = require('gotu')
const { Repository } = require('herbs2knex')

const User =
        entity('User', {
          id: field(Number),
          name: field(String),
          email: field(String)
        })

class UserRepository extends Repository {
    constructor(connection) {
        super({
            entity: User,
            table: 'users',
            ids: ['id'],
            knex: connection
        })
    }
}

const user = User.fromJSON({
    name: 'x',
    email: 'ex@ex.com.br'
})

const repo = new UserRepository(knex({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'postgres',
      database: 'todolist_on_herbs_db'
    }
  }))


const main = async () => {
    const created = await repo.insert(user)
    console.log(created)

    const [found] = await repo.findByID(created.id)
    console.log(found)

    found.name += found.name
     // Here I got an exception
    await repo.update(found)

    // TypeError: Cannot read property 'id' of undefined
    // at Object.get [as id] (/Users/italojs/dev/herbjs/herbs2knex/xp/node_modules/herbs2knex/src/dataMapper.js:121:48)
    // at Function.fromJSON (/Users/italojs/dev/herbjs/herbs2knex/xp/node_modules/gotu/src/baseEntity.js:119:96)
    // at DataMapper.toEntity (/Users/italojs/dev/herbjs/herbs2knex/xp/node_modules/herbs2knex/src/dataMapper.js:19:28)
    // at UserRepository.update (/Users/italojs/dev/herbjs/herbs2knex/xp/node_modules/herbs2knex/src/repository.js:164:28)
    // at processTicksAndRejections (internal/process/task_queues.js:93:5)
    // at async main (/Users/italojs/dev/herbjs/herbs2knex/xp/index.js:48:21)
}

main()
.then(() => console.log('done'))
.catch((error) => console.log(error))

