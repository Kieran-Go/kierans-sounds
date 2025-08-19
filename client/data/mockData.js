// A mock database to be used until a real back-end db is implemented
const mockDb = {
    sounds: [
        {
            id: 1,
            name: "RAIN 2",
            url: "https://res.cloudinary.com/de7vulkpy/video/upload/v1755486656/rain_ptogum.mp3",
        },
        {
            id: 2,
            name: "WAVES 2",
            url: "https://res.cloudinary.com/de7vulkpy/video/upload/v1755486693/waves_c5abqs.mp3",
        },
        {
            id: 3,
            name: "BIRDS 2",
            url: "https://res.cloudinary.com/de7vulkpy/video/upload/v1755486726/birds_s8iu2p.mp3",
        },
    ],

    songs: [
        {
            id: 1,
            name: "Midnight Rendezvous",
            author: "Final Fantasy VII Remake",
            url: "https://res.cloudinary.com/de7vulkpy/video/upload/v1755576590/Final_Fantasy_7_Remake_Midnight_Rendezvous_a2vhtt.mp3"
        },
        {
            id: 2,
            name: "Dire Dire Docks",
            author: "Super Mario 64",
            url: "https://res.cloudinary.com/de7vulkpy/video/upload/v1755576723/Super_Mario_64_Dire_Dire_Docks_mkiezb.mp3"
        },
        {
            id: 3,
            name: "Sunset Haze",
            author: "Gran Turismo 5",
            url: "https://res.cloudinary.com/de7vulkpy/video/upload/v1755576705/Gran_Turismo_5_Sunset_Haze_p4i37k.mp3"
        },
    ]
}

export default mockDb;