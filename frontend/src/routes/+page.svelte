<script>
	let email = '';
	let submitted = false;

	async function handleSubmit(event) {
		event.preventDefault();

		try {
			const response = await fetch('/api/newsletter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				submitted = true;
				email = '';
			}
		} catch (error) {
			console.error('Newsletter signup failed:', error);
		}
	}
</script>

<svelte:head>
	<title>Home - Your Business Name</title>
	<meta name="description" content="Welcome to our business. We provide excellent services and 24/7 AI-powered customer support." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-primary text-white py-5">
	<div class="container">
		<div class="row align-items-center">
			<div class="col-lg-6">
				<h1 class="display-4 fw-bold mb-4">Welcome to the Future of Customer Service</h1>
				<p class="lead mb-4">
					Experience seamless support with our AI-powered customer service agent,
					available 24/7 through our dynamically provisioned phone system.
				</p>
				<div class="d-flex gap-3">
					<a href="/support" class="btn btn-light btn-lg">
						<i class="bi bi-headset me-2"></i>Get Support Now
					</a>
					<a href="/services" class="btn btn-outline-light btn-lg">
						<i class="bi bi-info-circle me-2"></i>Learn More
					</a>
				</div>
			</div>
			<div class="col-lg-6">
				<div class="card bg-light">
					<div class="card-body p-4">
						<h3 class="card-title text-primary">AI-Powered Support</h3>
						<ul class="list-unstyled">
							<li class="mb-3">
								<i class="bi bi-check-circle-fill text-success me-2"></i>
								24/7 Availability
							</li>
							<li class="mb-3">
								<i class="bi bi-check-circle-fill text-success me-2"></i>
								Instant Response Times
							</li>
							<li class="mb-3">
								<i class="bi bi-check-circle-fill text-success me-2"></i>
								Natural Language Processing
							</li>
							<li class="mb-3">
								<i class="bi bi-check-circle-fill text-success me-2"></i>
								Phone & SMS Support
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="py-5">
	<div class="container">
		<div class="row text-center mb-5">
			<div class="col">
				<h2 class="display-5 fw-bold">Why Choose Us</h2>
				<p class="lead text-muted">Revolutionary customer service for the modern business</p>
			</div>
		</div>

		<div class="row g-4">
			<div class="col-md-4">
				<div class="text-center">
					<div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
						<i class="bi bi-robot display-4"></i>
					</div>
					<h4>AI-Powered Agent</h4>
					<p class="text-muted">
						Our advanced AI understands context and provides accurate, helpful responses to customer inquiries.
					</p>
				</div>
			</div>

			<div class="col-md-4">
				<div class="text-center">
					<div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
						<i class="bi bi-telephone display-4"></i>
					</div>
					<h4>Dynamic Phone Numbers</h4>
					<p class="text-muted">
						Automatically provisioned phone numbers ensure reliable, scalable customer communication channels.
					</p>
				</div>
			</div>

			<div class="col-md-4">
				<div class="text-center">
					<div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
						<i class="bi bi-cloud-arrow-up display-4"></i>
					</div>
					<h4>Cloud Infrastructure</h4>
					<p class="text-muted">
						Built on Google Cloud Platform for maximum reliability, scalability, and performance.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Newsletter Section -->
<section class="bg-light py-5">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-8 text-center">
				<h2 class="fw-bold mb-3">Stay Updated</h2>
				<p class="lead text-muted mb-4">
					Get the latest news and updates about our services and AI-powered customer support.
				</p>

				{#if submitted}
					<div class="alert alert-success" role="alert">
						<i class="bi bi-check-circle-fill me-2"></i>
						Thank you for subscribing! We'll be in touch soon.
					</div>
				{:else}
					<form on:submit={handleSubmit} class="d-flex gap-2 justify-content-center">
						<input
							type="email"
							class="form-control form-control-lg"
							placeholder="Enter your email address"
							bind:value={email}
							required
							style="max-width: 400px;"
						>
						<button type="submit" class="btn btn-primary btn-lg">
							<i class="bi bi-envelope me-2"></i>Subscribe
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-5">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-10">
				<div class="card border-0 shadow-sm">
					<div class="card-body p-5 text-center">
						<h2 class="card-title fw-bold mb-3">Ready to Experience the Future?</h2>
						<p class="card-text lead text-muted mb-4">
							Join thousands of satisfied customers who trust our AI-powered support system.
						</p>
						<div class="d-flex gap-3 justify-content-center flex-wrap">
							<a href="/support" class="btn btn-primary btn-lg">
								<i class="bi bi-headset me-2"></i>Contact Support
							</a>
							<a href="/portal" class="btn btn-outline-primary btn-lg">
								<i class="bi bi-person-circle me-2"></i>Customer Portal
							</a>
							<a href="/demo" class="btn btn-success btn-lg">
								<i class="bi bi-play-circle me-2"></i>Watch Demo
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');

	section {
		margin-bottom: 0;
	}

	.display-4 {
		font-weight: 700;
	}

	.lead {
		font-size: 1.25rem;
	}

	@media (max-width: 768px) {
		.display-4 {
			font-size: 2rem;
		}
	}
</style>
