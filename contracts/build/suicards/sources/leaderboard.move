module suicards::leaderboard {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::{Self, String};
    use sui::vec_map::{Self, VecMap};

    /// Leaderboard object stored on-chain
    public struct Leaderboard has key {
        id: UID,
        wins: VecMap<String, u64>,
        losses: VecMap<String, u64>,
        draws: VecMap<String, u64>,
    }

    /// Initialize leaderboard on deployment
    fun init(ctx: &mut TxContext) {
        let leaderboard = Leaderboard {
            id: object::new(ctx),
            wins: vec_map::empty(),
            losses: vec_map::empty(),
            draws: vec_map::empty(),
        };
        transfer::share_object(leaderboard);
    }

    /// Record a game result
    public entry fun record_result(
        leaderboard: &mut Leaderboard,
        winner: vector<u8>,
        loser: vector<u8>,
        is_draw: bool,
        _ctx: &mut TxContext
    ) {
        let winner_str = string::utf8(winner);
        let loser_str = string::utf8(loser);

        if (is_draw) {
            // Record draw for winner slot
            if (vec_map::contains(&leaderboard.draws, &winner_str)) {
                let draws = vec_map::get_mut(&mut leaderboard.draws, &winner_str);
                *draws = *draws + 1;
            } else {
                vec_map::insert(&mut leaderboard.draws, winner_str, 1);
            };
            // Record draw for loser slot
            if (vec_map::contains(&leaderboard.draws, &loser_str)) {
                let draws = vec_map::get_mut(&mut leaderboard.draws, &loser_str);
                *draws = *draws + 1;
            } else {
                vec_map::insert(&mut leaderboard.draws, loser_str, 1);
            };
        } else {
            // Record win
            if (vec_map::contains(&leaderboard.wins, &winner_str)) {
                let wins = vec_map::get_mut(&mut leaderboard.wins, &winner_str);
                *wins = *wins + 1;
            } else {
                vec_map::insert(&mut leaderboard.wins, winner_str, 1);
            };
            // Record loss
            if (vec_map::contains(&leaderboard.losses, &loser_str)) {
                let losses = vec_map::get_mut(&mut leaderboard.losses, &loser_str);
                *losses = *losses + 1;
            } else {
                vec_map::insert(&mut leaderboard.losses, loser_str, 1);
            };
        };
    }
}
