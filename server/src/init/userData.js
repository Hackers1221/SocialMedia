const users = [
    //     image: "https://i.pravatar.cc/200?img=1",
    //     name: "John Doe",
    //     username: "johndoe123",
    //     email: "johndoe@example.com",
    //     password: "Secure@123",
    //     following: [],
    //     birth: "1995-06-15",
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=2",
    //     name: "Jane Smith",
    //     username: "janesmith98",
    //     email: "janesmith@example.com",
    //     password: "Password!2024",
    //     following: [],
    //     birth: "1998-02-22"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=3",
    //     name: "Alex Johnson",
    //     username: "alexj99",
    //     email: "alexj@example.com",
    //     password: "Alex@Pass99",
    //     following: [],
    //     birth: "2000-09-10"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=4",
    //     name: "Michael Brown",
    //     username: "michaelb92",
    //     email: "michaelb@example.com",
    //     password: "Michael@123",
    //     following: [],
    //     birth: "1992-03-05"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=5",
    //     name: "Emma Wilson",
    //     username: "emmaw87",
    //     email: "emmaw@example.com",
    //     password: "Emma@567",
    //     following: [],
    //     birth: "1987-11-30"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=6",
    //     name: "Daniel Martinez",
    //     username: "danielm95",
    //     email: "danielm@example.com",
    //     password: "Daniel@890",
    //     following: [],
    //     birth: "1995-07-14"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=7",
    //     name: "Sophia Anderson",
    //     username: "sophiaa90",
    //     email: "sophiaa@example.com",
    //     password: "Sophia!456",
    //     following: [],
    //     birth: "1990-09-21"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=8",
    //     name: "William Harris",
    //     username: "williamh88",
    //     email: "williamh@example.com",
    //     password: "William@321",
    //     following: [],
    //     birth: "1988-12-19"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=9",
    //     name: "Olivia Clark",
    //     username: "oliviac99",
    //     email: "oliviac@example.com",
    //     password: "Olivia!987",
    //     following: [],
    //     birth: "1999-04-17"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=10",
    //     name: "James Lewis",
    //     username: "jamesl85",
    //     email: "jamesl@example.com",
    //     password: "James@654",
    //     following: [],
    //     birth: "1985-06-23"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=11",
    //     name: "Ava Walker",
    //     username: "avaw97",
    //     email: "avaw@example.com",
    //     password: "Ava!432",
    //     following: [],
    //     birth: "1997-08-12"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=12",
    //     name: "Benjamin Hall",
    //     username: "benjaminh93",
    //     email: "benjaminh@example.com",
    //     password: "Benjamin@876",
    //     following: [],
    //     birth: "1993-10-05"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=13",
    //     name: "Charlotte Young",
    //     username: "charlottey91",
    //     email: "charlottey@example.com",
    //     password: "Charlotte!543",
    //     following: [],
    //     birth: "1991-05-28"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=14",
    //     name: "Henry King",
    //     username: "henryk96",
    //     email: "henryk@example.com",
    //     password: "Henry@789",
    //     following: [],
    //     birth: "1996-03-15"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=15",
    //     name: "Mia Scott",
    //     username: "mias88",
    //     email: "mias@example.com",
    //     password: "Mia!210",
    //     following: [],
    //     birth: "1988-07-09"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=16",
    //     name: "Ethan Green",
    //     username: "ethang94",
    //     email: "ethang@example.com",
    //     password: "Ethan@123",
    //     following: [],
    //     birth: "1994-01-30"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=17",
    //     name: "Amelia Baker",
    //     username: "ameliab92",
    //     email: "ameliab@example.com",
    //     password: "Amelia!876",
    //     following: [],
    //     birth: "1992-02-14"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=18",
    //     name: "Lucas Carter",
    //     username: "lucasc89",
    //     email: "lucasc@example.com",
    //     password: "Lucas@543",
    //     following: [],
    //     birth: "1989-11-08"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=19",
    //     name: "Isabella Wright",
    //     username: "isabellaw99",
    //     email: "isabellaw@example.com",
    //     password: "Isabella!765",
    //     following: [],
    //     birth: "1999-06-25"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=20",
    //     name: "Mason Lopez",
    //     username: "masonl95",
    //     email: "masonl@example.com",
    //     password: "Mason@432",
    //     following: [],
    //     birth: "1995-12-03"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=21",
    //     name: "Ryan Adams",
    //     username: "ryana91",
    //     email: "ryana@example.com",
    //     password: "Ryan@123",
    //     following: [],
    //     birth: "1991-04-12"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=22",
    //     name: "Natalie Barnes",
    //     username: "natalieb90",
    //     email: "natalieb@example.com",
    //     password: "Natalie!456",
    //     following: [],
    //     birth: "1990-09-28"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=23",
    //     name: "Connor Bennett",
    //     username: "connorb92",
    //     email: "connorb@example.com",
    //     password: "Connor@789",
    //     following: [],
    //     birth: "1992-07-17"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=24",
    //     name: "Lily Carter",
    //     username: "lilyc94",
    //     email: "lilyc@example.com",
    //     password: "Lily!321",
    //     following: [],
    //     birth: "1994-12-05"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=25",
    //     name: "Owen Diaz",
    //     username: "owend93",
    //     email: "owend@example.com",
    //     password: "Owen@654",
    //     following: [],
    //     birth: "1993-03-30"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=26",
    //     name: "Chloe Evans",
    //     username: "chloee97",
    //     email: "chloee@example.com",
    //     password: "Chloe!789",
    //     following: [],
    //     birth: "1997-08-10"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=27",
    //     name: "Julian Foster",
    //     username: "julianf96",
    //     email: "julianf@example.com",
    //     password: "Julian@876",
    //     following: [],
    //     birth: "1996-06-14"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=28",
    //     name: "Zoey Garcia",
    //     username: "zoeyg98",
    //     email: "zoeyg@example.com",
    //     password: "Zoey!987",
    //     following: [],
    //     birth: "1998-11-22"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=29",
    //     name: "Isaac Hall",
    //     username: "isaach99",
    //     email: "isaach@example.com",
    //     password: "Isaac@543",
    //     following: [],
    //     birth: "1999-02-18"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=30",
    //     name: "Madeline King",
    //     username: "madelinek95",
    //     email: "madelinek@example.com",
    //     password: "Madeline!210",
    //     following: [],
    //     birth: "1995-10-27"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=31",
    //     name: "Sebastian Lee",
    //     username: "sebastianl94",
    //     email: "sebastianl@example.com",
    //     password: "Sebastian@321",
    //     following: [],
    //     birth: "1994-09-12"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=32",
    //     name: "Ella Morgan",
    //     username: "ellam93",
    //     email: "ellam@example.com",
    //     password: "Ella!765",
    //     following: [],
    //     birth: "1993-01-08"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=33",
    //     name: "Xavier Nelson",
    //     username: "xaviern97",
    //     email: "xaviern@example.com",
    //     password: "Xavier@987",
    //     following: [],
    //     birth: "1997-05-19"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=34",
    //     name: "Layla Owens",
    //     username: "laylao92",
    //     email: "laylao@example.com",
    //     password: "Layla!654",
    //     following: [],
    //     birth: "1992-03-07"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=35",
    //     name: "Aaron Perry",
    //     username: "aaronp98",
    //     email: "aaronp@example.com",
    //     password: "Aaron@543",
    //     following: [],
    //     birth: "1998-12-31"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=36",
    //     name: "Samantha Reed",
    //     username: "samanthar96",
    //     email: "samanthar@example.com",
    //     password: "Samantha!210",
    //     following: [],
    //     birth: "1996-07-14"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=37",
    //     name: "Eli Richardson",
    //     username: "elir99",
    //     email: "elir@example.com",
    //     password: "Eli@123",
    //     following: [],
    //     birth: "1999-04-25"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=38",
    //     name: "Victoria Sanders",
    //     username: "victorias91",
    //     email: "victorias@example.com",
    //     password: "Victoria!567",
    //     following: [],
    //     birth: "1991-06-08"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=39",
    //     name: "Nathan Turner",
    //     username: "nathant95",
    //     email: "nathant@example.com",
    //     password: "Nathan@789",
    //     following: [],
    //     birth: "1995-08-16"
    // },
    // {
    //     image: "https://i.pravatar.cc/200?img=40",
    //     name: "Isla White",
    //     username: "islaw94",
    //     email: "islaw@example.com",
    //     password: "Isla!432",
    //     following: [],
    //     birth: "1994-09-30"
    // },
    {
        image: "https://i.pravatar.cc/200?img=41",
        name: "Rounak kumar",
        username: "rounak12",
        email: "rounak@gmail.com",
        password: "Rounak@123",
        following: [],
        birth: "2004-05-19",
    },
    {
        image: "https://i.pravatar.cc/200?img=42",
        name: "Ebison Sojan",
        username: "ebison12",
        email: "ebison@gmail.com",
        password: "Ebison@123",
        following: [],
        birth: "2004-05-20",
    },
    {
        image: "https://i.pravatar.cc/200?img=43",
        name: "Reshab Prasad",
        username: "reshab12",
        email: "reshab@gmail.com",
        password: "Reshab@123",
        following: [],
        birth: "2004-05-21",
    }
];

module.exports = { sampleUsers: users };