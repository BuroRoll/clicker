async function callClick() {
    let response = await fetch('/click/', {
        method: 'GET'
    });
    let answer = await response.json();
    document.getElementById("data").innerHTML = answer.coinsCount;
    console.log(answer.boosts);
    if (answer.boosts)
        render_all_boosts(answer.boosts);

}

async function getUser(id) {
    let response = await fetch('/users/' + id, {
        method: 'GET'
    });
    let answer = await response.json();

    document.getElementById("user").innerHTML = answer['username'];
    let getCycle = await fetch('/cycles/' + answer['cycle'], {
        method: 'GET'
    });
    let cycle = await getCycle.json();
    document.getElementById("data").innerHTML = cycle['coinsCount'];
    document.getElementById("clickPower").innerHTML = cycle['clickPower'];
    let boost_request = await fetch('/boosts/' + answer.cycle, {
        method: 'GET'
    })
    let boosts = await boost_request.json()
    render_all_boosts(boosts)
}


function buyBoost(boost_level) {
    let boost_price = Number.MAX_VALUE;
    let coins = BigInt(document.getElementById('data').innerHTML)
    let boost = document.getElementById('boostPrice_' + boost_level)
    if (boost !== null) {
        boost_price = BigInt(boost.innerHTML)
    } else {
        boost_price = 10
    }

    if (coins >= boost_price) {
        const csrftoken = getCookie('csrftoken')
        fetch('/buyBoost/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                boost_level: boost_level
            })
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response)
            }
        }).then(data => {
            document.getElementById("data").innerHTML = data['coinsCount'];
            document.getElementById("clickPower").innerHTML = data['clickPower'];
            let c_lvl = 'boostLevel_' + data['level']
            let c_power = 'boostPower_' + data['level']
            let c_price = 'boostPrice_' + data['level']
            document.getElementById(c_power).innerHTML = data['boost_power'];
            document.getElementById(c_lvl).innerHTML = data['level'];
            document.getElementById(c_price).innerHTML = data['price'];
        })
    }

}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function render_all_boosts(boosts) {
    let parent = document.getElementById('boost-wrapper')

    if (parent.children.length > 1) {
        parent.innerHTML = ''
    }

    boosts.forEach(boost => {
        render_boost(parent, boost)
    })
    if (parent.children.length > 1) {
        // parent.innerHTML = ''
        let b = document.getElementById('boost-holder')
        b.remove()
    }
}

function render_boost(parent, boost) {
    console.log(boost);
    const div = document.createElement('div')
    div.setAttribute('class', 'boost-holder')
    div.setAttribute('id', `boost-holder-${boost.level}`)
    div.innerHTML = `
    
                <div class="item-1">
                    <input type="image" style="height: 147px; width: 150px; border-radius: 20px" src="https://www.dogecoin.nl/assets/yu-dum-fuk.jpeg"
                           onclick="buyBoost(${boost.level})"/>
                </div>
                
                <div class="item-2">
                    <div class="box-1">
                      
                        
                       <div>Boost Power
                            <div id="boostPower_${boost.level}">${boost.power}</div>
                       </div>
                        <div>Boost Price
                            <div id="boostPrice_${boost.level}">${boost.price}</div>
                       </div>
                    
                    </div>
                    <div class="box-2">
                        <div>Уровень буста<div id="boostLevel_${boost.level}">${boost.level}</div></div>
                        
                        
                    </div>
                </div>
            
        

  `
    parent.appendChild(div)
}
