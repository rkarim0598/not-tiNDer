let mixin = {
    methods: {
        checkLoggedIn: function(error) {
            return error.includes('Not logged in') ?
                true : false
        }
    }
}

export default mixin;