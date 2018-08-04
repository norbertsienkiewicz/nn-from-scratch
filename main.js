/* helpers */
const ANIMATE_LEARNING_PROCESS = false;
const TRAIN_POINTS_NUMBER = 10000; // higher = more accurate, but animation takes longer

const X_MAX = 400;
const Y_MAX = 400;

const TEAM_A = 1;
const TEAM_B = -1;

const rand = (high, low) => Math.random() * (high - low) + low;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const generatePoints = (num = 200) => Array(num).fill(0).map(_ => ({
    x: rand(0, X_MAX),
    y: rand(0, Y_MAX)
}));

(async () => {
    const randomPoints = generatePoints(200);

    const guess = (weights, point) => {
        const sum =
            point.x * weights.x +
            point.y * weights.y;
        const team = sum >= 0 ? TEAM_A : TEAM_B;
        return team;
    };

    const LEARNING_RATE = 0.05
    const train = (weights, point, team) => {
        const guessResult = guess(weights, point);
        const error = team - guessResult;
        return {
            x: weights.x + point.x * error * LEARNING_RATE,
            y: weights.y + point.y * error * LEARNING_RATE,
        };
    };

    const teamAssignment = point => point.x > point.y ? TEAM_A : TEAM_B;
    const trainedWeights = async (initialWeights) => {
        const examples = generatePoints(TRAIN_POINTS_NUMBER).map(point => ({
            point,
            team: teamAssignment(point),
        }));

        let currentWeights = initialWeights;
        for (const example of examples) {
            currentWeights = train(currentWeights, example.point, example.team);
            if (ANIMATE_LEARNING_PROCESS) {
                await sleep(1);
                render(randomPoints, currentWeights);
            }
        }
        return currentWeights;
    };

    console.log('-- LEARNING');
    const initialWeights = ({
        x: rand(-1, 1),
        y: rand(-1, 1),
    });
    const weights = await trainedWeights(initialWeights);
    console.log('-- LEARNED');
    render(randomPoints, weights);

    function render(points, weights) {
        const html = `
            <svg width="${X_MAX}" height="${Y_MAX}">
                ${points.map(point =>
                    `<circle
                        cx="${point.x}"
                        cy="${point.y}"
                        r="3"
                        fill="${guess(weights, point) > 0 ? 'blue' : 'red'}"
                    />
                `)}
                <line x1="0" x2="${X_MAX}" y1="0" y2="${Y_MAX}" stroke="purple" />
            </svg>
        `;
        document.querySelector('#root').innerHTML = html;
    };
})();
