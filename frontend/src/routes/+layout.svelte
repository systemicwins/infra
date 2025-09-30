<script>
	import '../app.css';
</script>

<div class="min-vh-100 d-flex flex-column">
	<!-- Navigation -->
	<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
		<div class="container">
			<a class="navbar-brand fw-bold" href="/">
				<img src="/logo.png" alt="Logo" width="30" height="30" class="d-inline-block align-text-top me-2">
				Your Business Name
			</a>

			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav me-auto">
					<li class="nav-item">
						<a class="nav-link" href="/">Home</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/services">Services</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/about">About</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/contact">Contact</a>
					</li>
				</ul>

				<div class="d-flex">
					<a href="/support" class="btn btn-outline-light me-2">Get Support</a>
					<a href="/portal" class="btn btn-light">Customer Portal</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="flex-grow-1">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="bg-dark text-light py-5 mt-5">
		<div class="container">
			<div class="row">
				<div class="col-md-4">
					<h5>Your Business Name</h5>
					<p>Providing excellent service since 2024</p>
					<p class="mb-0">&copy; 2024 Your Business Name. All rights reserved.</p>
				</div>
				<div class="col-md-4">
					<h5>Quick Links</h5>
					<ul class="list-unstyled">
						<li><a href="/privacy" class="text-light text-decoration-none">Privacy Policy</a></li>
						<li><a href="/terms" class="text-light text-decoration-none">Terms of Service</a></li>
						<li><a href="/support" class="text-light text-decoration-none">Support</a></li>
					</ul>
				</div>
				<div class="col-md-4">
					<h5>Contact Info</h5>
					<p><i class="bi bi-telephone-fill me-2"></i> <span id="support-phone">Loading...</span></p>
					<p><i class="bi bi-envelope-fill me-2"></i> support@yourbusiness.com</p>
					<p><i class="bi bi-geo-alt-fill me-2"></i> Your City, State</p>
				</div>
			</div>
		</div>
	</footer>
</div>

<script>
	// Load the support phone number from the backend
	async function loadPhoneNumber() {
		try {
			const response = await fetch('/api/phone-number');
			const data = await response.json();
			document.getElementById('support-phone').textContent = data.phoneNumber || 'Call us soon!';
		} catch (error) {
			console.error('Failed to load phone number:', error);
			document.getElementById('support-phone').textContent = 'Call us soon!';
		}
	}

	loadPhoneNumber();
</script>

<style>
	@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');
</style>
