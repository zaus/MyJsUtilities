theFiddle = {};
!(function (core) {
	//#region ------------------ util -------------------
	_domlog = function () {
		_domlog.$output.innerHTML += "\n" + Array.prototype.slice.call(arguments, 0).join(", ");
		_log.apply(_log, arguments);
	}
	_domlog.$output = document.getElementById('console-output');
	//#endregion ------------------ util -------------------


	// the trick here is that methods need to be scoped to this to properly utilize child classes
	var BaseClass = Define(function () {
		this.__initialize.apply(this, arguments);
	}, {
		AsString: function () { return '[' + this.getId.call(this) + ']'; }
		, getId: function () { return this.id; }
		, __initialize: function () {
			this.id = BaseClass._index++;
		}
	});
	BaseClass._index = 0; // counter

	//#region -------------- user declaration ----------
	var User = Inherits(BaseClass, function (first, last, avatar, bio) {
		this._parent.__initialize.call(this); // call base "constructor" scoped to child class
		// this.id = BaseClass._index++;

		// do your extra stuff here
		this.First = first;
		this.Last = last;
		this.Avatar = avatar || 'http://lorempixel.com/g/400/200/people/' + this.getId();
		this.Bio = bio || 'No bio...yet.';
	});
	// attach methods, overrides
	Define(User, {
		AsString: function () {
			return this.getName() + ' ' + this._parent.AsString.call(this); // again, scope base class to self
		}
		,
		getName: function () {
			return this.First + ' ' + this.Last;
		}
	});
	//#endregion -------------- user declaration ----------

	//#region -------------- comment declaration ----------
	var Comment = Inherits(BaseClass, function (title, content, authorId) {
		this._parent.__initialize.call(this); // call base "constructor" scoped to child class

		this.Title = title || 'Comment #' + this.getId();
		this.Content = content;
		this.AuthorId = authorId;
	});
	// more methods
	Define(Comment, {
		AsString: function () {
			return this.Title + ' || ' + this.Content + ' @' + this.getAuthor().getName() + ' ' + this._parent.AsString.call(this); // again, scope base class to self
		}
		,
		getAuthor: function (repo) {
			var ME = this;
			return $.grep(repo || ME._repo, function (el) {
				return el.getId() == ME.AuthorId;
			})[0];
		}//-- fn getAuthor
	});
	//#endregion -------------- comment declaration ----------


	var lib = {
		users: []
		,
		comments: []
		,
		templates: {
			avatar: new Templater('tmpl-avatar')
			, profile: new Templater('tmpl-profile')
			, comment: new Templater('tmpl-comment')
			, commentWrapper: new Templater('tmpl-comment-in-list')
		}
		,
		ui: {
			$commentList: $('#comments .template-list')
			,
			$userList: $('#users .template-list')
		}
	};
	// attach dependent objects
	lib.users = [
		new User('aaaa', 'AAAA')
		, new User('bbbb', 'BBBBB Jr.')
		, new User('cccc', 'CCCCC')
	];
	lib.comments = [
		new Comment('I was here first', 'First!', lib.users[0].getId())
		, new Comment('That\'s very interesting', 'I\'d like to hear more of your proposition, you should visit my blog <a href="#">http://fakesite.net</a>.', lib.users[1].getId())
		, new Comment('Bacon ipsum dolor sit amet', '<p>Beef ribs beef prosciutto flank jowl ground round. Spare ribs venison pork chop hamburger cow, sausage swine drumstick. <em>Short ribs corned beef pastrami</em> flank pig, pancetta ball tip sirloin pork chop kielbasa chuck brisket drumstick.</p> <p>Shankle short ribs biltong pancetta, cow spare ribs fatback corned beef short loin pastrami ham hock. Beef spare ribs jerky chuck, andouille tail salami swine meatball filet mignon short ribs venison strip steak shank fatback.</p>', lib.users[2].getId())
		, new Comment('Kielbasa sausage tongue pancetta prosciutto', 'Ham capicola frankfurter pig pork loin beef ribs short loin filet mignon sirloin t-bone. Tenderloin swine meatloaf boudin pork loin pork beef ribs salami filet mignon sausage jerky meatball. Sirloin jowl strip steak tenderloin tongue, chuck tail rump short loin filet mignon pork chop ham hock capicola meatloaf beef ribs.', lib.users[0].getId())
		, new Comment('Meatloaf sausage hamburger jowl', 'T-bone meatball swine, tenderloin kielbasa short ribs pork chop pork loin filet mignon chuck tri-tip boudin corned beef pig ground round. Brisket doner meatloaf hamburger. <strong>Andouille ball tip turducken</strong> spare ribs filet mignon beef. Shank meatball filet mignon jowl drumstick, pastrami meatloaf doner salami shankle short loin bacon.', lib.users[2].getId())
	];


	// lazy: internalization of comment repo
	Define(Comment, {
		_repo: lib.users
	});

	lib.users[1].Bio = '<p><strong>Invented the internet</strong> whilst ridding the world of <em>bandersnatches</em>.</p><p>Moonlights as a private detective in Palermo.</p>';

	$.each(lib.users, function () {
		_domlog(this, this.AsString());
	});
	$.each(lib.comments, function () {
		_domlog(this, this.AsString());
	});


	// now template everything
	$.each(lib.comments, function (i, comment) {
		lib.ui.$commentList.append(
			lib.templates.commentWrapper.render({
				comment: lib.templates.comment.render(comment)
				, avatar: lib.templates.avatar.render(comment.getAuthor())
			})
		);
	});
	$.each(lib.users, function (i, user) {
		lib.ui.$userList.append(
			lib.templates.profile.render(user)
		);
	});

	$.extend(core, lib);
})(theFiddle);