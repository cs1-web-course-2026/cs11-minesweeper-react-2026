export default function GameMessage({
    status,
}) {

    if (status === 'win') {
        return <h2>Ви перемогли 🎉</h2>;
    }

    if (status === 'lose') {
        return <h2>Ви програли 💣</h2>;
    }

    return null;
}
