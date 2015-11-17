//script.js

// change id for mongodb id: from id to _id
Backbone.Model.prototype.idAttribute ='_id';

//Backbone model

var Blog= Backbone.Model.extend({
	defaults: {
		author: '',
		title: '',
		url: ''
	}
});

//Backbone collection

var Blogs = Backbone.Collection.extend({
	url: 'http://localhost:3000/api/blogs',
});

//instatine two BLogs
/*
var blog1 = new Blog({
	author: 'matej',
		title: 'matej blog',
		url: 'http://matej.si'
});

var blog2 = new Blog({
	author: 'nezka',
		title: 'nezkin blog',
		url: 'http://nezka.si'
});
*/
// instatiate collection

var blogs = new Blogs();

// Backbone View


// Backbone viev fo
var BlogView = Backbone.View.extend({
	model: new Blog(),
	tagName: 'tr',
	initialize: function() {
		this.template = _.template($('.blogs-list-template').html());
	},
	events: {
		'click .edit-blog': 'edit',
		'click .update-blog': 'update',
		'click .cancel-blog': 'cancel',
		'click .delete-blog': 'delete'
	},
	edit: function(){
		this.$('.edit-blog').hide();
		this.$('.delete-blog').hide();
		this.$('.update-blog').show();
		this.$('.cancel-blog').show();

		var author = this.$('.author').html();
		var title = this.$('.title').html();
		var url = this.$('.url').html();
		
		this.$('.author').html('<input type="text" class="form-control author-update" value="'+ author+'">');
		this.$('.title').html('<input type="text" class="form-control title-update" value="'+ title+'">');
		this.$('.url').html('<input type="text" class="form-control url-update" value="'+ url+'">');

			
	},
	update: function(){
		this.model.set('author',$('.author-update').val());
		this.model.set('title',$('.title-update').val());
		this.model.set('url',$('.url-update').val());

		this.model.save(null, {
			success: function(response) {
				console.log ('Successfully updated blogs _id'+ response.toJSON()._id);
			},
			error: function(){
				console.log('Faild to updae blog!');
			}
		});
	},
	cancel: function(){
		blogsView.render();
	},
	delete: function(){
		this.model.destroy({
			success: function(response) {
				console.log ('Successfully DELETED blog with _id:'+ response.toJSON()._id);
			},
			error: function() {
				console.log('Faild to Delete blog');
			}
		});
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var BlogsView = Backbone.View.extend({
	model: blogs,
	el: $('.blogs-list'),
	initialize: function() {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('change', function() {
			setTimeout(function(){
				self.render();
			}, 30);
		}, this);
		this.model.on('remove', this.render, this);

		this.model.fetch({
			success: function(response) {
				_.each(response.toJSON(), function(item){
					console.log ('Successfully GOT blog with _id: '+ item._id);
				});
			},
			error: function(){
				console.log('Faild to get blogs');
			}
		});
	},
	render: function() {
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(blog) {
			self.$el.append((new BlogView({model: blog})).render().$el);
		});
		return this;
	}
	});

var blogsView = new BlogsView();
$(document).ready(function(){
	$('.add-blog').on('click', function(){
		var blog = new Blog({
			author: $('.author-input').val(),
			title: $('.title-input').val(),
			url: $('.url-input').val(),
		});
		$('.author-input').val('');
		$('.title-input').val('');
		$('.url-input').val('');
		blogs.add(blog);

		blog.save(null, {
			success: function(response){
				console.log("Successfully saved blog with id:"+ response.toJSON()._id);
			},
			error: function() {
				console.log('Faild to save blog');
			}
		});
	});

});