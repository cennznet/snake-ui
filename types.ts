export const snakeTypes = {
    Direction: {
        _enum: ["Up", "Left", "Down", "Right"]
    },
    Food: {
        x: "i8",
        y: "i8"
    },
    Snake: {
        body: "Vec<(i8,i8)>",
        dir: "Direction",
        direction_changed: "bool"
    },
    WindowSize: {
        window_width: "i8",
        window_height: "i8"
    },
    BlockLength: {
        max: 'PerDispatchClassU32'
    },
    BlockWeights: {
        baseBlock: 'Weight',
        maxBlock: 'Weight',
        perClass: 'PerDispatchClass'
    },
    PerDispatchClassU32: {
        normal: 'u32',
        operational: 'u32',
        mandatory: 'u32'
    },
    PerDispatchClass: {
        normal: 'WeightPerClass',
        operational: 'WeightPerClass',
        mandatory: 'WeightPerClass'
    },
    WeightPerClass: {
        baseExtrinsic: 'Weight',
        maxExtrinsic: 'Weight',
        maxTotal: 'Option<Weight>',
        reserved: 'Option<Weight>'
    },
    ConsumedWeight: 'PerDispatchClass',
    Slot: 'u64'
}

