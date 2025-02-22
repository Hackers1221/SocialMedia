const users = [
    {
        image: "https://i.pravatar.cc/200?img=26",
        name: "Chloe Evans",
        username: "chloee97",
        email: "chloee@example.com",
        password: "Chloe!789",
        following: [],
        birth: "1997-08-10"
    },
    {
        image: "https://i.pravatar.cc/200?img=27",
        name: "Julian Foster",
        username: "julianf96",
        email: "julianf@example.com",
        password: "Julian@876",
        following: [],
        birth: "1996-06-14"
    },
    {
        image: "https://i.pravatar.cc/200?img=28",
        name: "Zoey Garcia",
        username: "zoeyg98",
        email: "zoeyg@example.com",
        password: "Zoey!987",
        following: [],
        birth: "1998-11-22"
    },
    {
        image: "https://i.pravatar.cc/200?img=29",
        name: "Isaac Hall",
        username: "isaach99",
        email: "isaach@example.com",
        password: "Isaac@543",
        following: [],
        birth: "1999-02-18"
    },
    {
        image: "https://i.pravatar.cc/200?img=30",
        name: "Madeline King",
        username: "madelinek95",
        email: "madelinek@example.com",
        password: "Madeline!210",
        following: [],
        birth: "1995-10-27"
    },
    {
        image: "https://i.pravatar.cc/200?img=31",
        name: "Sebastian Lee",
        username: "sebastianl94",
        email: "sebastianl@example.com",
        password: "Sebastian@321",
        following: [],
        birth: "1994-09-12"
    },
    {
        image: "https://i.pravatar.cc/200?img=32",
        name: "Ella Morgan",
        username: "ellam93",
        email: "ellam@example.com",
        password: "Ella!765",
        following: [],
        birth: "1993-01-08"
    },
    {
        image: "https://i.pravatar.cc/200?img=33",
        name: "Xavier Nelson",
        username: "xaviern97",
        email: "xaviern@example.com",
        password: "Xavier@987",
        following: [],
        birth: "1997-05-19"
    },
    {
        image: "https://i.pravatar.cc/200?img=34",
        name: "Layla Owens",
        username: "laylao92",
        email: "laylao@example.com",
        password: "Layla!654",
        following: [],
        birth: "1992-03-07"
    },
    {
        image: "https://i.pravatar.cc/200?img=35",
        name: "Aaron Perry",
        username: "aaronp98",
        email: "aaronp@example.com",
        password: "Aaron@543",
        following: [],
        birth: "1998-12-31"
    },
    {
        image: "https://i.pravatar.cc/200?img=36",
        name: "Samantha Reed",
        username: "samanthar96",
        email: "samanthar@example.com",
        password: "Samantha!210",
        following: [],
        birth: "1996-07-14"
    },
    {
        image: "https://i.pravatar.cc/200?img=37",
        name: "Eli Richardson",
        username: "elir99",
        email: "elir@example.com",
        password: "Eli@123",
        following: [],
        birth: "1999-04-25"
    },
    {
        image: "https://i.pravatar.cc/200?img=38",
        name: "Victoria Sanders",
        username: "victorias91",
        email: "victorias@example.com",
        password: "Victoria!567",
        following: [],
        birth: "1991-06-08"
    },
    {
        image: "https://i.pravatar.cc/200?img=39",
        name: "Nathan Turner",
        username: "nathant95",
        email: "nathant@example.com",
        password: "Nathan@789",
        following: [],
        birth: "1995-08-16"
    },
    {
        image: "https://i.pravatar.cc/200?img=40",
        name: "Isla White",
        username: "islaw94",
        email: "islaw@example.com",
        password: "Isla!432",
        following: [],
        birth: "1994-09-30"
    },
    {
        image: "https://i.pravatar.cc/200?img=41",
        name: "Rounak kumar",
        username: "rounak12",
        email: "rounak@gmail.com",
        password: "Rounak@123",
        following: [],
        birth: "2004-05-19",
        saved : [
            {
                "image": [
                  "https://tse1.mm.bing.net/th?id=OIP.eD9-ocppLL5dduPpP7lzPAHaEK&w=266&h=266&c=7"
                ],
                "video": [],
                "likes": [],
                "caption": "Exploring new places!",
                "comments": [],
                "interests": ["Travel", "Photography"],
                "userId": "67b998dc215cfb8ea63f02cc",
                "createdAt": "2025-02-22T12:00:00Z"
              },
              {
                "image": [
                  "https://tse3.mm.bing.net/th?id=OIP.URX3g3SmLfWwSuPr459ibwHaHw&w=474&h=474&c=7"
                ],
                "video": [],
                "likes": [],
                "caption": "Nature at its best!",
                "comments": [],
                "interests": ["Nature", "Wildlife"],
                "userId": "67b998dc215cfb8ea63f02cc",
                "createdAt": "2025-02-22T12:05:00Z"
              },
              {
                "image": [],
                "video": [
                  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                ],
                "likes": [],
                "caption": "Throwback to an amazing moment! 🎥",
                "comments": [],
                "interests": ["Movies", "Entertainment"],
                "userId": "67b998dc215cfb8ea63f02cc",
                "createdAt": "2025-02-22T12:10:00Z"
              },
              {
                "image": [
                  "https://tse1.mm.bing.net/th?id=OIP.eD9-ocppLL5dduPpP7lzPAHaEK&w=266&h=266&c=7"
                ],
                "video": [],
                "likes": [],
                "caption": "Exploring new places!",
                "comments": [],
                "interests": ["Travel", "Photography"],
                "userId": "67b998dc215cfb8ea63f02cc",
                "createdAt": "2025-02-22T12:00:00Z"
              },
              {
                "image": [
                  "https://tse3.mm.bing.net/th?id=OIP.URX3g3SmLfWwSuPr459ibwHaHw&w=474&h=474&c=7"
                ],
                "video": [],
                "likes": [],
                "caption": "Nature at its best!",
                "comments": [],
                "interests": ["Nature", "Wildlife"],
                "userId": "67b998dc215cfb8ea63f02cc",
                "createdAt": "2025-02-22T12:05:00Z"
              },
              {
                "image": [],
                "video": [
                  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                ],
                "likes": [],
                "caption": "Throwback to an amazing moment! 🎥",
                "comments": [],
                "interests": ["Movies", "Entertainment"],
                "userId": "67b998dc215cfb8ea63f02cc",
                "createdAt": "2025-02-22T12:10:00Z"
              }
        ]
    }

];

module.exports = { sampleUsers: users };  