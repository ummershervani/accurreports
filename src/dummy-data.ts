import {
    adjectives,
    colors,
    animals,
    names,
    countries
} from "unique-names-generator"

function normal(min: number, max: number, skew: number = 1): number {
    let u = 0,
        v = 0
    while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) num = normal(min, max, skew) // resample between 0 and 1 if out of range
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
    return num
}

function random_between(min: number, max: number): number {
    return (Math.random() * (max - min) + min) | 0
}

function skew(value: number = 4): number {
    if (Math.random() >= 0.5) {
        return 1 / random_between(1, value)
    } else {
        return random_between(1, value)
    }
}

let skews = new Map<number, number>()

export interface Data {
    [index: string]: any
    name: string
    color: string
    animal: string
    adjective: string
    country: string
    age: number
    value: number
    description: string
}

export let data = Array.from(
    { length: 1000000 },
    (): Data => {
        let country = random_between(0, countries.length - 1)
        if (!skews.has(country)) {
            skews.set(country, skew())
        }
        let sk = skews.get(country)
        let name =
            names[(normal(0, names.length, sk) | (0 + country)) % names.length]
        let color =
            colors[
                (normal(0, colors.length, sk) | (0 + country)) % colors.length
            ]
        let animalIndex =
            (normal(0, animals.length, sk) | (0 + country)) % animals.length
        let animal = animals[animalIndex]
        let adjective =
            adjectives[
                (normal(0, adjectives.length, sk) | (0 + country)) %
                    adjectives.length
            ]
        let age = normal(18, 90, sk) | 0
        let value =
            normal(200, 50000, (animalIndex / animals.length) * 5 + 0.3) | 0
        return {
            name,
            color,
            animal,
            country: countries[country],
            adjective,
            age,
            value,
            description: `${name} the ${color} ${animal} from ${
                countries[country]
            }`
        }
    }
).sort(sortInOrder)

function sortInOrder(a: Data, b: Data) {
    return a.description === b.description
        ? 0
        : a.description > b.description
        ? 1
        : -1
}
