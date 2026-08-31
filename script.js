/* =====================================================
   EMPIRE//X V3
===================================================== */


/* =====================================================
   GAME DATA
===================================================== */

const businessData = {

    tech:{
        name:"NEXUS AI LABS",
        icon:"◈",
        price:250000,
        income:35000,
        desc:"Artificial intelligence, software and futuristic technology."
    },

    auto:{
        name:"VOLT MOTORS",
        icon:"◆",
        price:350000,
        income:48000,
        desc:"Electric vehicles and autonomous transportation."
    },

    energy:{
        name:"NOVA ENERGY",
        icon:"⚡",
        price:450000,
        income:70000,
        desc:"Advanced clean-energy infrastructure."
    },

    factory:{
        name:"TITAN INDUSTRIES",
        icon:"▣",
        price:300000,
        income:42000,
        desc:"High-tech manufacturing and robotics."
    },

    hotel:{
        name:"ORBITAL HOTELS",
        icon:"◇",
        price:400000,
        income:52000,
        desc:"Luxury hotels and corporate hospitality."
    },

    logistics:{
        name:"VECTOR LOGISTICS",
        icon:"⬡",
        price:325000,
        income:45000,
        desc:"Global logistics and automated delivery."
    }

};


/* =====================================================
   GAME STATE
===================================================== */

let game = {

    ceo:"",

    company:"",

    industry:"tech",

    difficulty:"normal",

    day:1,

    hour:8,

    money:1000000,

    reputation:50,

    level:1,

    xp:0,

    shares:0,

    employees:[],

    businesses:{
        tech:0,
        auto:0,
        energy:0,
        factory:0,
        hotel:0,
        logistics:0
    },

    upgrades:{
        tech:1,
        auto:1,
        energy:1,
        factory:1,
        hotel:1,
        logistics:1
    },

    stocks:{
        TECH:500,
        AUTO:750,
        ENERGY:400,
        ROBOT:620,
        LOGISTICS:540
    },

    oldStocks:{
        TECH:500,
        AUTO:750,
        ENERGY:400,
        ROBOT:620,
        LOGISTICS:540
    },

    missions:{
        first:false,
        employee:false,
        shares:false,
        million:false,
        level5:false,
        businesses:false
    },

    player:{
        x:0,
        z:10
    },

    sound:true,

    music:false

};


/* =====================================================
   SETUP
===================================================== */

let selectedIndustry="tech";

document
.querySelectorAll(".industry")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        document
        .querySelectorAll(".industry")
        .forEach(x=>x.classList.remove("selected"));

        btn.classList.add("selected");

        selectedIndustry=
            btn.dataset.industry;

    });

});


document
.getElementById("startGame")
.addEventListener("click",()=>{

    const ceo=
        document
        .getElementById("ceoInput")
        .value
        .trim();

    const company=
        document
        .getElementById("companyInput")
        .value
        .trim();


    if(!ceo){

        alert("Enter your CEO name.");

        return;

    }


    if(!company){

        alert("Enter your company name.");

        return;

    }


    game.ceo=ceo;

    game.company=company;

    game.industry=
        selectedIndustry;

    game.difficulty=
        document
        .getElementById("difficulty")
        .value;


    if(game.difficulty==="easy")
        game.money=1500000;

    if(game.difficulty==="hard")
        game.money=700000;


    save();

    start();

});


/* =====================================================
   START
===================================================== */

function start(){

    document
    .getElementById("startScreen")
    .classList.add("hidden");

    document
    .getElementById("game")
    .classList.remove("hidden");


    document
    .getElementById("ceoName")
    .textContent=game.ceo;

    document
    .getElementById("panelCompany")
    .textContent=game.company;

    document
    .getElementById("headerCompany")
    .textContent=game.company;


    init3D();

    render();

    setTimeout(()=>{

        alertMessage(
            "EMPIRE INITIALIZED",
            "Welcome "+game.ceo+
            ". "+game.company+
            " is now operational."
        );

    },800);

}


/* =====================================================
   SAVE / LOAD
===================================================== */

function save(){

    localStorage.setItem(
        "EMPIRE_X_V3",
        JSON.stringify(game)
    );

}


function load(){

    const data=
        localStorage.getItem(
            "EMPIRE_X_V3"
        );


    if(!data)
        return false;


    try{

        const saved=
            JSON.parse(data);


        game={
            ...game,
            ...saved,
            businesses:{
                ...game.businesses,
                ...(saved.businesses||{})
            },
            upgrades:{
                ...game.upgrades,
                ...(saved.upgrades||{})
            },
            stocks:{
                ...game.stocks,
                ...(saved.stocks||{})
            },
            oldStocks:{
                ...game.oldStocks,
                ...(saved.oldStocks||{})
            },
            missions:{
                ...game.missions,
                ...(saved.missions||{})
            }
        };


        return true;

    }catch{

        return false;

    }

}


/* =====================================================
   AUTO LOAD
===================================================== */

if(load()){

    start();

}


/* =====================================================
   THREE.JS WORLD
===================================================== */

let scene;
let camera;
let renderer;
let playerMesh;

let cars=[];

let buildings=[];

let clock=
    new THREE.Clock();


function init3D(){

    scene=
        new THREE.Scene();


    scene.background=
        new THREE.Color(
            0x02070b
        );


    camera=
        new THREE.PerspectiveCamera(
            65,
            1,
            .1,
            1000
        );


    renderer=
        new THREE.WebGLRenderer({
            antialias:true
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    document
    .getElementById("three")
    .appendChild(renderer.domElement);


    resize();


    const ambient=
        new THREE.HemisphereLight(
            0x8bdfff,
            0x020305,
            1.5
        );

    scene.add(ambient);


    const sun=
        new THREE.DirectionalLight(
            0xffffff,
            2
        );

    sun.position.set(
        30,
        50,
        20
    );

    sun.castShadow=true;

    scene.add(sun);


    createWorld();

    createPlayer();

    createCars();


    window.addEventListener(
        "resize",
        resize
    );


    animate();

}


/* =====================================================
   WORLD
===================================================== */

function createWorld(){

    const ground=
        new THREE.Mesh(

            new THREE.PlaneGeometry(
                300,
                300
            ),

            new THREE.MeshStandardMaterial({
                color:0x05090c
            })

        );


    ground.rotation.x=
        -Math.PI/2;

    scene.add(ground);


    /* ROADS */

    const roadMat=
        new THREE.MeshStandardMaterial({
            color:0x10171b
        });


    const road1=
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                14,
                300
            ),
            roadMat
        );

    road1.rotation.x=
        -Math.PI/2;

    road1.position.y=.02;

    scene.add(road1);


    const road2=
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                300,
                12
            ),
            roadMat
        );

    road2.rotation.x=
        -Math.PI/2;

    road2.position.y=.025;

    scene.add(road2);


    /* CITY */

    for(let i=0;i<55;i++){

        let x=
            (Math.random()-.5)*100;

        let z=
            (Math.random()-.5)*100;


        if(
            Math.abs(x)<10 ||
            Math.abs(z)<8
        )
            continue;


        const width=
            2+
            Math.random()*4;

        const depth=
            2+
            Math.random()*4;

        const height=
            3+
            Math.random()*15;


        const building=
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    height,
                    depth
                ),

                new THREE.MeshStandardMaterial({
                    color:
                        0x111a20,
                    metalness:.5,
                    roughness:.5
                })

            );


        building.position.set(
            x,
            height/2,
            z
        );


        scene.add(building);

        buildings.push(building);


        createBuildingLights(
            x,
            height,
            z,
            width
        );

    }


    createHQ();

}


/* =====================================================
   BUILDING LIGHTS
===================================================== */

function createBuildingLights(
    x,
    height,
    z,
    width
){

    for(
        let y=1;
        y<height;
        y+=2
    ){

        if(Math.random()>.55)
            continue;


        const light=
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    .08,
                    .35,
                    .4
                ),

                new THREE.MeshBasicMaterial({
                    color:
                        Math.random()>.2
                        ?0x00dfff
                        :0xffb62e
                })

            );


        light.position.set(
            x-width/2-.04,
            y,
            z
        );


        scene.add(light);

    }

}


/* =====================================================
   HQ
===================================================== */

function createHQ(){

    const group=
        new THREE.Group();


    const tower=
        new THREE.Mesh(

            new THREE.BoxGeometry(
                9,
                23,
                9
            ),

            new THREE.MeshStandardMaterial({
                color:0x18262e,
                metalness:.8,
                roughness:.25
            })

        );


    tower.position.y=11.5;

    group.add(tower);


    const core=
        new THREE.Mesh(

            new THREE.BoxGeometry(
                1,
                24,
                1
            ),

            new THREE.MeshBasicMaterial({
                color:0x00eaff
            })

        );


    core.position.y=12;

    group.add(core);


    const roof=
        new THREE.Mesh(

            new THREE.BoxGeometry(
                11,
                .7,
                11
            ),

            new THREE.MeshStandardMaterial({
                color:0x26343b,
                metalness:.8
            })

        );


    roof.position.y=23.5;

    group.add(roof);


    group.position.set(
        0,
        0,
        -20
    );


    scene.add(group);

}


/* =====================================================
   PLAYER
===================================================== */

function createPlayer(){

    playerMesh=
        new THREE.Group();


    const body=
        new THREE.Mesh(

            new THREE.BoxGeometry(
                .8,
                1.4,
                .6
            ),

            new THREE.MeshStandardMaterial({
                color:0x00eaff,
                metalness:.6
            })

        );


    body.position.y=1;


    const head=
        new THREE.Mesh(

            new THREE.SphereGeometry(
                .34,
                16,
                16
            ),

            new THREE.MeshStandardMaterial({
                color:0xd7e1e4
            })

        );


    head.position.y=2;


    playerMesh.add(body);
    playerMesh.add(head);


    playerMesh.position.set(
        game.player.x,
        0,
        game.player.z
    );


    scene.add(playerMesh);

}


/* =====================================================
   CARS
===================================================== */

function createCars(){

    for(let i=0;i<10;i++){

        const car=
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.4,
                    .5,
                    2.4
                ),

                new THREE.MeshStandardMaterial({
                    color:
                        i%2
                        ?0x087cff
                        :0x00dfff
                })

            );


        car.position.set(
            -5,
            .35,
            -70+i*14
        );


        scene.add(car);

        cars.push(car);

    }

}


/* =====================================================
   ANIMATION
===================================================== */

function animate(){

    requestAnimationFrame(
        animate
    );


    const delta=
        clock.getDelta();


    cars.forEach(car=>{

        car.position.z+=
            delta*6;


        if(car.position.z>75)
            car.position.z=-75;

    });


    if(playerMesh){

        playerMesh.position.x=
            game.player.x;

        playerMesh.position.z=
            game.player.z;


        camera.position.x +=
            (
                game.player.x-
                camera.position.x
            )*.08;


        camera.position.z +=
            (
                game.player.z+13-
                camera.position.z
            )*.08;


        camera.position.y +=
            (
                8-
                camera.position.y
            )*.08;


        camera.lookAt(
            game.player.x,
            1,
            game.player.z-4
        );

    }


    renderer.render(
        scene,
        camera
    );

}


/* =====================================================
   RESIZE
===================================================== */

function resize(){

    const world=
        document.getElementById("world");


    if(!renderer)
        return;


    const width=
        world.clientWidth;

    const height=
        world.clientHeight;


    camera.aspect=
        width/height;

    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height
    );

}


/* =====================================================
   MOVEMENT
===================================================== */

function move(key){

    const speed=.7;


    if(key==="w")
        game.player.z-=speed;

    if(key==="s")
        game.player.z+=speed;

    if(key==="a")
        game.player.x-=speed;

    if(key==="d")
        game.player.x+=speed;


    game.player.x=
        Math.max(
            -45,
            Math.min(
                45,
                game.player.x
            )
        );


    game.player.z=
        Math.max(
            -70,
            Math.min(
                70,
                game.player.z
            )
        );

}


document.addEventListener(
    "keydown",
    e=>{

        const key=
            e.key.toLowerCase();


        if(
            ["w","a","s","d"]
            .includes(key)
        ){

            move(key);

        }

    }
);


document
.querySelectorAll("[data-move]")
.forEach(btn=>{

    btn.addEventListener(
        "click",
        ()=>{
            move(
                btn.dataset.move
            );
        }
    );

});


/* =====================================================
   MONEY
===================================================== */

function cash(value){

    return "₹"+
        Math.floor(value)
        .toLocaleString("en-IN");

}


/* =====================================================
   DAILY PROFIT
===================================================== */

function dailyProfit(){

    let total=0;


    Object.keys(
        game.businesses
    ).forEach(key=>{

        const owned=
            game.businesses[key];

        const level=
            game.upgrades[key];


        total+=
            owned*
            businessData[key].income*
            (
                1+
                (level-1)*.25
            );

    });


    total+=
        game.employees.length*
        2500;


    total*=
        game.reputation/50;


    return Math.floor(total);

}


/* =====================================================
   COMPANY VALUE
===================================================== */

function companyValue(){

    let value=
        game.money;


    Object.keys(
        game.businesses
    ).forEach(key=>{

        value+=
            game.businesses[key]*
            businessData[key].price;

    });


    value+=
        game.employees.length*
        15000;


    value+=
        game.shares*
        game.stocks.TECH;


    return value;

}


/* =====================================================
   BUY BUSINESS
===================================================== */

function buyBusiness(key){

    const data=
        businessData[key];


    if(game.money<data.price){

        toast(
            "INSUFFICIENT CAPITAL"
        );

        return;

    }


    game.money-=
        data.price;


    game.businesses[key]++;


    game.reputation=
        Math.min(
            100,
            game.reputation+2
        );


    addXP(100);


    if(
        !game.missions.first
    ){

        game.missions.first=true;

        addXP(250);

        toast(
            "MISSION COMPLETE +250 XP"
        );

    }


    if(
        Object.values(
            game.businesses
        ).filter(x=>x>0).length>=3
    ){

        game.missions.businesses=true;

    }


    toast(
        data.name+
        " ACQUIRED"
    );


    render();

}


/* =====================================================
   UPGRADE
===================================================== */

function upgradeBusiness(key){

    if(
        game.businesses[key]===0
    ){

        toast(
            "ACQUIRE THE BUSINESS FIRST"
        );

        return;

    }


    const level=
        game.upgrades[key];


    const cost=
        Math.floor(
            businessData[key].price*
            level*
            .35
        );


    if(game.money<cost){

        toast(
            "NOT ENOUGH CAPITAL"
        );

        return;

    }


    game.money-=cost;

    game.upgrades[key]++;


    addXP(80);


    toast(
        "BUSINESS LEVEL "+
        game.upgrades[key]
    );


    render();

}


/* =====================================================
   HIRE
===================================================== */

function hire(){

    const cost=25000;


    if(game.money<cost){

        toast(
            "NOT ENOUGH CAPITAL"
        );

        return;

    }


    game.money-=cost;


    const names=[
        "ALEX",
        "MAYA",
        "RYAN",
        "ZARA",
        "LEO",
        "NOVA",
        "KAI",
        "ARIA",
        "NOAH",
        "LUNA"
    ];


    const employee={

        name:
            names[
                Math.floor(
                    Math.random()*
                    names.length
                )
            ],

        skill:
            50+
            Math.floor(
                Math.random()*50
            ),

        productivity:
            60+
            Math.floor(
                Math.random()*40
            )

    };


    game.employees.push(
        employee
    );


    addXP(50);


    if(
        game.employees.length>=5
    ){

        game.missions.employee=true;

        addXP(200);

    }


    toast(
        employee.name+
        " JOINED THE COMPANY"
    );


    render();

}


/* =====================================================
   STOCK
===================================================== */

function buyStock(){

    const price=
        game.stocks.TECH;


    if(game.money<price){

        toast(
            "NOT ENOUGH CAPITAL"
        );

        return;

    }


    game.money-=price;

    game.shares++;


    addXP(25);


    if(game.shares>=5){

        game.missions.shares=true;

    }


    toast(
        "TECH SHARE ACQUIRED"
    );


    render();

}


function sellStock(){

    if(game.shares<=0){

        toast(
            "NO TECH SHARES"
        );

        return;

    }


    game.money+=
        game.stocks.TECH;

    game.shares--;


    toast(
        "TECH SHARE SOLD"
    );


    render();

}


/* =====================================================
   MARKET
===================================================== */

function updateMarket(){

    Object.keys(
        game.stocks
    ).forEach(key=>{

        game.oldStocks[key]=
            game.stocks[key];


        let movement=
            Math.random()*.18-.09;


        game.stocks[key]=
            Math.max(
                50,
                game.stocks[key]*
                (1+movement)
            );

    });

}


/* =====================================================
   RANDOM EVENTS
===================================================== */

const events=[

    {
        title:"TECH BOOM",
        text:"Technology demand has exploded.",
        multiplier:1.2
    },

    {
        title:"MARKET CRASH",
        text:"Investors panic across the fictional market.",
        multiplier:.8
    },

    {
        title:"MEGA CONTRACT",
        text:"Your corporation wins a massive city contract.",
        multiplier:1.3
    },

    {
        title:"SUPPLY CRISIS",
        text:"Production costs have increased.",
        multiplier:.85
    },

    {
        title:"ENERGY BREAKTHROUGH",
        text:"A major energy discovery boosts the economy.",
        multiplier:1.25
    },

    {
        title:"RIVAL ATTACK",
        text:"A competitor launches an aggressive campaign.",
        multiplier:.9
    },

    {
        title:"CONSUMER BOOM",
        text:"Demand rises across the city.",
        multiplier:1.15
    }

];


function randomEvent(){

    const event=
        events[
            Math.floor(
                Math.random()*
                events.length
            )
        ];


    game.money*=
        event.multiplier;


    if(event.multiplier>1){

        game.reputation=
            Math.min(
                100,
                game.reputation+2
            );

    }else{

        game.reputation=
            Math.max(
                0,
                game.reputation-2
            );

    }


    document
    .getElementById("eventTitle")
    .textContent=
        event.title;


    document
    .getElementById("eventText")
    .textContent=
        event.text;


    alertMessage(
        event.title,
        event.text
    );

}


/* =====================================================
   NEXT DAY
===================================================== */

function nextDay(){

    const profit=
        dailyProfit();


    game.money+=profit;


    game.day++;

    game.hour=8;


    updateMarket();

    randomEvent();

    addXP(100);


    if(
        companyValue()>=
        10000000
    ){

        game.missions.million=true;

    }


    save();

    render();

    toast(
        "DAY "+
        game.day+
        " • PROFIT "+
        cash(profit)
    );

}


/* =====================================================
   COLLECT PROFIT
===================================================== */

function collect(){

    const profit=
        dailyProfit();


    game.money+=profit;


    addXP(50);

    save();

    render();


    toast(
        "COLLECTED "+
        cash(profit)
    );

}


/* =====================================================
   XP
===================================================== */

function addXP(amount){

    game.xp+=amount;


    while(
        game.xp>=
        game.level*500
    ){

        game.xp-=
            game.level*500;

        game.level++;


        toast(
            "LEVEL UP → "+
            game.level
        );


        if(
            game.level>=5
        ){

            game.missions.level5=true;

        }

    }

}


/* =====================================================
   BUSINESS RENDER
===================================================== */

function renderBusinesses(){

    const list=
        document.getElementById(
            "businessList"
        );


    list.innerHTML="";


    Object.keys(
        businessData
    ).forEach(key=>{

        const data=
            businessData[key];


        const owned=
            game.businesses[key];


        const level=
            game.upgrades[key];


        const upgradeCost=
            Math.floor(
                data.price*
                level*
                .35
            );


        const card=
            document.createElement(
                "div"
            );


        card.className=
            "businessCard";


        card.innerHTML=`

            <div class="businessHead">

                <h3>
                    ${data.name}
                </h3>

                <span>
                    ${data.icon}
                </span>

            </div>

            <p class="businessDesc">
                ${data.desc}
            </p>

            <div class="businessInfo">

                <div>
                    OWNED
                    <b>${owned}</b>
                </div>

                <div>
                    LEVEL
                    <b>${level}</b>
                </div>

                <div>
                    /DAY
                    <b>
                    ${cash(
                        data.income*
                        (
                            1+
                            (level-1)*.25
                        )
                    )}
                    </b>
                </div>

            </div>

            <div class="businessButtons">

                <button
                    onclick="buyBusiness('${key}')"
                >
                    BUY
                    ${cash(data.price)}
                </button>

                ${
                    owned>0
                    ?
                    `
                    <button
                        onclick="upgradeBusiness('${key}')"
                    >
                        UPGRADE
                        ${cash(upgradeCost)}
                    </button>
                    `
                    :
                    ""
                }

            </div>

        `;


        list.appendChild(card);

    });

}


/* =====================================================
   EMPLOYEE RENDER
===================================================== */

function renderEmployees(){

    const list=
        document.getElementById(
            "employeeList"
        );


    list.innerHTML="";


    game.employees.forEach(
        (employee,index)=>{

            const card=
                document.createElement(
                    "div"
                );


            card.className=
                "employeeCard";


            card.innerHTML=`

                <div>

                    <strong>
                        ${employee.name}
                    </strong>

                    <small>
                        EMPLOYEE #${index+1}
                    </small>

                </div>

                <div class="employeeStats">

                    <div>
                        <strong>
                            ${employee.skill}
                        </strong>

                        <small>
                            SKILL
                        </small>
                    </div>

                    <div>
                        <strong>
                            ${employee.productivity}%
                        </strong>

                        <small>
                            OUTPUT
                        </small>
                    </div>

                </div>

            `;


            list.appendChild(card);

        }
    );

}


/* =====================================================
   MARKET RENDER
===================================================== */

function renderMarket(){

    const list=
        document.getElementById(
            "marketList"
        );


    list.innerHTML="";


    Object.keys(
        game.stocks
    ).forEach(key=>{

        const current=
            game.stocks[key];

        const old=
            game.oldStocks[key];


        const up=
            current>=old;


        const card=
            document.createElement(
                "div"
            );


        card.className=
            "stockCard";


        card.innerHTML=`

            <div>

                <strong>
                    ${key}
                </strong>

                <small>
                    FICTIONAL COMPANY
                </small>

            </div>

            <div>
                ${cash(current)}
            </div>

            <div class="${up?"up":"down"}">
                ${up?"▲":"▼"}
            </div>

        `;


        list.appendChild(card);

    });

}


/* =====================================================
   MISSIONS
===================================================== */

function renderMissions(){

    const list=
        document.getElementById(
            "missionList"
        );


    const missions=[

        {
            title:"FIRST EMPIRE",
            text:"Acquire your first business.",
            reward:"250 XP",
            done:game.missions.first
        },

        {
            title:"BUILD THE TEAM",
            text:"Hire 5 employees.",
            reward:"200 XP",
            done:game.missions.employee
        },

        {
            title:"MARKET PLAYER",
            text:"Own 5 TECH shares.",
            reward:"300 XP",
            done:game.missions.shares
        },

        {
            title:"CORPORATE GIANT",
            text:"Reach ₹1 crore company value.",
            reward:"1000 XP",
            done:game.missions.million
        },

        {
            title:"RISING CEO",
            text:"Reach level 5.",
            reward:"750 XP",
            done:game.missions.level5
        },

        {
            title:"EXPANSION",
            text:"Own at least 3 different businesses.",
            reward:"500 XP",
            done:game.missions.businesses
        }

    ];


    list.innerHTML="";


    missions.forEach(m=>{

        const card=
            document.createElement(
                "div"
            );


        card.className=
            "mission "+
            (
                m.done
                ?"complete"
                :""
            );


        card.innerHTML=`

            <h3>
                ${m.done?"✓ ":""}
                ${m.title}
            </h3>

            <p>
                ${m.text}
            </p>

            <span>
                REWARD: ${m.reward}
            </span>

        `;


        list.appendChild(card);

    });

}


/* =====================================================
   CHART
===================================================== */

let chartData=[
    40,44,42,48,50,47,55,52,61,58
];


function drawChart(){

    const canvas=
        document.getElementById(
            "chart"
        );


    const ctx=
        canvas.getContext("2d");


    canvas.width=
        canvas.clientWidth*2;

    canvas.height=
        canvas.clientHeight*2;


    const w=canvas.width;

    const h=canvas.height;


    ctx.clearRect(
        0,
        0,
        w,
        h
    );


    ctx.strokeStyle=
        "#00eaff";

    ctx.lineWidth=4;


    ctx.beginPath();


    chartData.forEach(
        (v,i)=>{

            const x=
                i/
                (chartData.length-1)*
                w;


            const y=
                h-
                v/100*h;


            if(i===0)
                ctx.moveTo(x,y);
            else
                ctx.lineTo(x,y);

        }
    );


    ctx.stroke();


    chartData.push(
        Math.max(
            10,
            Math.min(
                95,
                chartData[
                    chartData.length-1
                ]+
                Math.random()*12-6
            )
        )
    );


    if(chartData.length>20)
        chartData.shift();

}


/* =====================================================
   RENDER
===================================================== */

function render(){

    document
    .getElementById("money")
    .textContent=
        cash(game.money);


    document
    .getElementById("day")
    .textContent=
        game.day;


    document
    .getElementById("time")
    .textContent=
        String(
            Math.floor(game.hour)
        ).padStart(2,"0")+
        ":00";


    document
    .getElementById("companyValue")
    .textContent=
        cash(companyValue());


    document
    .getElementById("dailyProfit")
    .textContent=
        cash(dailyProfit());


    document
    .getElementById("reputation")
    .textContent=
        Math.floor(
            game.reputation
        )+
        "%";


    document
    .getElementById("employees")
    .textContent=
        game.employees.length;


    document
    .getElementById("level")
    .textContent=
        game.level;


    document
    .getElementById("shares")
    .textContent=
        game.shares;


    const needed=
        game.level*500;


    document
    .getElementById("xpBar")
    .style.width=
        Math.min(
            100,
            game.xp/needed*100
        )+
        "%";


    document
    .getElementById("terminalText")
    .textContent=
        game.company+
        " operational. "+
        "Current corporate value: "+
        cash(companyValue())+
        ". Daily profit: "+
        cash(dailyProfit())+
        ".";


    renderBusinesses();

    renderEmployees();

    renderMarket();

    renderMissions();

    drawChart();

}


/* =====================================================
   NAVIGATION
===================================================== */

document
.querySelectorAll(".tab")
.forEach(tab=>{

    tab.addEventListener(
        "click",
        ()=>{

            document
            .querySelectorAll(".tab")
            .forEach(
                x=>
                x.classList.remove(
                    "active"
                )
            );


            document
            .querySelectorAll(".tabPage")
            .forEach(
                x=>
                x.classList.remove(
                    "active"
                )
            );


            tab.classList.add(
                "active"
            );


            document
            .getElementById(
                tab.dataset.tab
            )
            .classList.add(
                "active"
            );

        }
    );

});


/* =====================================================
   BUTTONS
===================================================== */

document
.getElementById("collectBtn")
.onclick=
    collect;


document
.getElementById("advanceBtn")
.onclick=
    nextDay;


document
.getElementById("hireBtn")
.onclick=
    hire;


document
.getElementById("buyStock")
.onclick=
    buyStock;


document
.getElementById("sellStock")
.onclick=
    sellStock;


/* =====================================================
   INTERACT
===================================================== */

document
.getElementById("interact")
.onclick=
    ()=>{

        const distance=
            Math.sqrt(
                game.player.x*
                game.player.x+
                (game.player.z+20)*
                (game.player.z+20)
            );


        if(distance<15){

            alertMessage(
                "HQ TERMINAL",
                game.company+
                " headquarters online."
            );

            document
            .querySelector(
                '[data-tab="overview"]'
            )
            .click();

        }else{

            toast(
                "MOVE CLOSER TO HQ"
            );

        }

    };


/* =====================================================
   ALERT
===================================================== */

function alertMessage(
    title,
    text
){

    const alert=
        document.getElementById(
            "worldAlert"
        );


    document
    .getElementById("alertTitle")
    .textContent=
        title;


    document
    .getElementById("alertText")
    .textContent=
        text;


    alert.classList.add("show");


    setTimeout(
        ()=>{
            alert.classList.remove("show");
        },
        4000
    );

}


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function toast(text){

    const element=
        document.getElementById(
            "toast"
        );


    element.textContent=text;

    element.classList.add("show");


    clearTimeout(
        toastTimer
    );


    toastTimer=
        setTimeout(
            ()=>{
                element.classList.remove(
                    "show"
                );
            },
            2200
        );

}


/* =====================================================
   SETTINGS
===================================================== */

function openSettings(){

    document
    .getElementById(
        "settingsOverlay"
    )
    .classList.remove("hidden");

}


function closeSettings(){

    document
    .getElementById(
        "settingsOverlay"
    )
    .classList.add("hidden");

}


document
.getElementById("settingsBtn")
.onclick=
    openSettings;


document
.getElementById("settingsFooter")
.onclick=
    openSettings;


document
.querySelector(".closeSettings")
.onclick=
    closeSettings;


/* SOUND */

document
.getElementById("soundToggle")
.onclick=
    function(){

        game.sound=
            !game.sound;

        this.textContent=
            game.sound
            ?"ON"
            :"OFF";

        save();

    };


/* MUSIC */

document
.getElementById("musicToggle")
.onclick=
    function(){

        game.music=
            !game.music;

        this.textContent=
            game.music
            ?"ON"
            :"OFF";

        toast(
            "MUSIC "+
            (
                game.music
                ?"ENABLED"
                :"DISABLED"
            )
        );

        save();

    };


/* SAVE */

document
.getElementById("saveSettings")
.onclick=
    ()=>{

        save();

        toast(
            "GAME SAVED"
        );

    };


/* =====================================================
   RESET ACCOUNT
===================================================== */

document
.getElementById("resetAccount")
.onclick=
    ()=>{

        document
        .getElementById(
            "resetOverlay"
        )
        .classList.remove(
            "hidden"
        );

    };


document
.getElementById("cancelReset")
.onclick=
    ()=>{

        document
        .getElementById(
            "resetOverlay"
        )
        .classList.add(
            "hidden"
        );

    };


document
.getElementById("confirmReset")
.onclick=
    ()=>{

        localStorage.removeItem(
            "EMPIRE_X_V3"
        );

        location.reload();

    };


/* =====================================================
   CLOCK
===================================================== */

setInterval(
    ()=>{

        if(
            document
            .getElementById("game")
            .classList
            .contains("hidden")
        )
            return;


        game.hour+=.5;


        if(game.hour>=24){

            nextDay();

        }


        document
        .getElementById("time")
        .textContent=
            String(
                Math.floor(game.hour)
            ).padStart(2,"0")+
            ":00";


    },
    3000
);


/* =====================================================
   AUTO SAVE
===================================================== */

setInterval(
    ()=>{
        if(
            !document
            .getElementById("game")
            .classList
            .contains("hidden")
        ){
            save();
        }
    },
    15000
);


/* =====================================================
   INITIAL SETTINGS UI
===================================================== */

if(game.sound){

    document
    .getElementById("soundToggle")
    .textContent="ON";

}
