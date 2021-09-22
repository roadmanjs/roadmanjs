import {roadman} from './index';
import {Model, ObjectType, InputType, Field} from 'couchset';

@InputType('PersonInput')
@ObjectType()
class Person {
    @Field(() => String, {nullable: true})
    id?: string = '';

    @Field(() => String, {nullable: true})
    firstname?: string = '';

    @Field(() => String, {nullable: true})
    lastname?: string = '';

    @Field(() => Number, {nullable: true})
    phone?: number = 0;
}

const PersonModel = new Model('Person', {graphqlType: Person});
const {resolver} = PersonModel.automate({
    getById: {public: true},
    createUpdate: {public: true},
    pagination: {public: true},
});

const run = async () => {
    await roadman({resolvers: [resolver]});
};

run();
