module.exports = {
	name: "guildMemberUpdate",
	async execute(oldMember, newMember) {
		//console.log(oldMember, newMember);
    
    //var defaultHost = "https://forum.citydao.io/";
    
    /* 
    / Grab object for the new role
    / newRoleId = ID of the changed Role
    / newRoleName = Name of the changed Role
    */
    const newRole = newMember.roles.cache.difference(oldMember.roles.cache).last();
    const {id:newRoleId, name:newRoleName} = newRole;

		//console.log(newRole);
		console.log(`Role ID: ${newRoleId}`);
		console.log(`Role Name: ${newRoleName}`);

		console.log(newMember.roles.cache);

    /* 
    / MemberNickName = Discord nickname of the current user (string)
    / MemberId = Discord ID of the current user (snowflake)
    / MemberName = Discord username (if no username then nickname) of the current user (string)
    */ 
    const MemberNickName = newMember.nickname;
    const MemberId = newMember.id;
    const MemberName = newMember.displayName;
    console.log(`Nickname: ${MemberNickName}`);
    console.log(`ID: ${MemberId}`);
    console.log(`Name: ${MemberName}`);

    // check whether we added or removed roles
    const newMemberSize = newMember.roles.cache.size;
    const oldMemberSize = oldMember.roles.cache.size;
		console.log(`new size: ${newMemberSize}`);
		console.log(`old size: ${oldMemberSize}`);
		// needed to +1 for oldMemberSize due to @everyone role in discord
    if(newMemberSize > oldMemberSize) {
      // add logic for added role
      console.log("role added");
    } else {
      // add logic for removed role
      console.log("role removed");
    };
	},
};