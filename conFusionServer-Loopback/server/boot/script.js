module.exports = app => {
    let Customer = app.models.Customer;

    Customer.findOne({ username: 'Admin' }, (err, users) => {
        if (users) {
            console.log('Admin user already exists');
        } else {
            Customer.create([
                {
                    username: 'Admin',
                    password: '12345678',
                    email: 'admin@example.com'
                }
            ], (err, users) => {
                if (err) {
                    throw err;
                }

                let Role = app.models.Role;
                let RoleMapping = app.models.RoleMapping;

                RoleMapping.destroyAll();

                Role.findOne({ name: 'admin' }, (err, role) => {
                    if (!role) {
                        Role.create({ name: 'admin' }, (err, role) => {
                            if (err) {
                                throw err;
                            }

                            role.principals.create({
                                principalType: RoleMapping.USER,
                                principalId: users[0].id
                            }, (err, principal) => {
                                if (err) {
                                    throw err;
                                }
                            });
                        })
                    } else {
                        role.principals.create({
                            principalType: RoleMapping.USER,
                            principalId: users[0].id
                        }, (err, principal) => {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                })
            });
        }
    });
}
