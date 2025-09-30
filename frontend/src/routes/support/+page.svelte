<script>
	let name = '';
	let email = '';
	let subject = '';
	let message = '';
	let submitted = false;
	let isLoading = false;

	async function handleSubmit(event) {
		event.preventDefault();
		isLoading = true;

		try {
			const response = await fetch('/api/support-ticket', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					email,
					subject,
					message
				}),
			});

			if (response.ok) {
				submitted = true;
				name = '';
				email = '';
				subject = '';
				message = '';
			}
		} catch (error) {
			console.error('Support ticket submission failed:', error);
			alert('Failed to submit support ticket. Please try again.');
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Support - Your Business Name</title>
	<meta name="description" content="Get help from our AI-powered customer support team. Available 24/7 via phone, SMS, or web form." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-primary text-white py-5">
	<div class="container">
		<div class="row text-center">
			<div class="col">
				<h1 class="display-4 fw-bold mb-3">Customer Support</h1>
				<p class="lead">Get help from our AI-powered support team, available 24/7</p>
			</div>
		</div>
	</div>
</section>

<!-- Contact Methods -->
<section class="py-5">
	<div class="container">
		<div class="row text-center mb-5">
			<div class="col">
				<h2 class="fw-bold">Choose Your Support Channel</h2>
				<p class="lead text-muted">Multiple ways to get the help you need</p>
			</div>
		</div>

		<div class="row g-4">
			<!-- Phone Support -->
			<div class="col-lg-4">
				<div class="card h-100 border-0 shadow-sm text-center">
					<div class="card-body p-4">
						<div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
							<i class="bi bi-telephone display-4"></i>
						</div>
						<h4 class="card-title">Phone Support</h4>
						<p class="card-text text-muted mb-4">
							Speak directly with our AI agent for immediate assistance.
						</p>
						<h3 class="text-primary mb-3" id="phone-number">Loading...</h3>
						<p class="text-muted small">Available 24/7</p>
						<a href="tel:" class="btn btn-primary btn-lg" id="call-button">
							<i class="bi bi-telephone me-2"></i>Call Now
						</a>
					</div>
				</div>
			</div>

			<!-- SMS Support -->
			<div class="col-lg-4">
				<div class="card h-100 border-0 shadow-sm text-center">
					<div class="card-body p-4">
						<div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
							<i class="bi bi-chat-dots display-4"></i>
						</div>
						<h4 class="card-title">SMS Support</h4>
						<p class="card-text text-muted mb-4">
							Send a text message and get instant responses.
						</p>
						<h3 class="text-success mb-3" id="sms-number">Loading...</h3>
						<p class="text-muted small">Text us anytime</p>
						<a href="sms:" class="btn btn-success btn-lg" id="sms-button">
							<i class="bi bi-chat me-2"></i>Send SMS
						</a>
					</div>
				</div>
			</div>

			<!-- Web Form -->
			<div class="col-lg-4">
				<div class="card h-100 border-0 shadow-sm text-center">
					<div class="card-body p-4">
						<div class="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
							<i class="bi bi-envelope display-4"></i>
						</div>
						<h4 class="card-title">Support Ticket</h4>
						<p class="card-text text-muted mb-4">
							Submit a detailed support request for complex issues.
						</p>
						<p class="text-muted small mb-3">Response within 24 hours</p>
						<button class="btn btn-info btn-lg" type="button" data-bs-toggle="collapse" data-bs-target="#support-form">
							<i class="bi bi-pencil-square me-2"></i>Create Ticket
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Support Form (Collapsible) -->
<section class="py-4">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-8">
				<div class="collapse" id="support-form">
					<div class="card border-0 shadow-sm">
						<div class="card-body p-4">
							<h3 class="card-title text-center mb-4">Submit Support Ticket</h3>

							{#if submitted}
								<div class="alert alert-success text-center" role="alert">
									<i class="bi bi-check-circle-fill me-2"></i>
									Thank you! Your support ticket has been submitted successfully.
									We'll get back to you within 24 hours.
								</div>
							{:else}
								<form on:submit={handleSubmit}>
									<div class="row">
										<div class="col-md-6 mb-3">
											<label for="name" class="form-label">Full Name *</label>
											<input
												type="text"
												class="form-control"
												id="name"
												bind:value={name}
												required
											>
										</div>
										<div class="col-md-6 mb-3">
											<label for="email" class="form-label">Email Address *</label>
											<input
												type="email"
												class="form-control"
												id="email"
												bind:value={email}
												required
											>
										</div>
									</div>

									<div class="mb-3">
										<label for="subject" class="form-label">Subject *</label>
										<input
											type="text"
											class="form-control"
											id="subject"
											bind:value={subject}
											required
											placeholder="Brief description of your issue"
										>
									</div>

									<div class="mb-3">
										<label for="message" class="form-label">Message *</label>
										<textarea
											class="form-control"
											id="message"
											rows="5"
											bind:value={message}
											required
											placeholder="Please provide detailed information about your issue..."
										></textarea>
									</div>

									<div class="d-grid">
										<button
											type="submit"
											class="btn btn-primary btn-lg"
											disabled={isLoading}
										>
											{#if isLoading}
												<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
												Submitting...
											{:else}
												<i class="bi bi-send me-2"></i>Submit Ticket
											{/if}
										</button>
									</div>
								</form>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FAQ Section -->
<section class="bg-light py-5">
	<div class="container">
		<div class="row text-center mb-5">
			<div class="col">
				<h2 class="fw-bold">Frequently Asked Questions</h2>
				<p class="lead text-muted">Quick answers to common questions</p>
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col-lg-8">
				<div class="accordion" id="faqAccordion">
					<div class="accordion-item">
						<h2 class="accordion-header" id="headingOne">
							<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
								<strong>How does the AI support agent work?</strong>
							</button>
						</h2>
						<div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
							<div class="accordion-body">
								Our AI agent uses advanced natural language processing to understand your questions and provide accurate, helpful responses. It's available 24/7 and can handle a wide range of inquiries.
							</div>
						</div>
					</div>

					<div class="accordion-item">
						<h2 class="accordion-header" id="headingTwo">
							<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
								<strong>Can I speak to a human representative?</strong>
							</button>
						</h2>
						<div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
							<div class="accordion-body">
								For complex issues that require human intervention, our AI agent can escalate your case to a human representative who will contact you within 24 hours.
							</div>
						</div>
					</div>

					<div class="accordion-item">
						<h2 class="accordion-header" id="headingThree">
							<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
								<strong>What information should I have ready when contacting support?</strong>
							</button>
						</h2>
						<div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
							<div class="accordion-body">
								Please have your account information, order details, or any relevant reference numbers ready. This helps us assist you more efficiently.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<script>
	// Load phone numbers from the API
	async function loadPhoneNumbers() {
		try {
			const response = await fetch('/api/phone-numbers');
			const data = await response.json();

			const phoneNumberElement = document.getElementById('phone-number');
			const smsNumberElement = document.getElementById('sms-number');
			const callButton = document.getElementById('call-button');
			const smsButton = document.getElementById('sms-button');

			if (data.phoneNumber) {
				phoneNumberElement.textContent = data.phoneNumber;
				callButton.href = `tel:${data.phoneNumber}`;
			}

			if (data.smsNumber) {
				smsNumberElement.textContent = data.smsNumber;
				smsButton.href = `sms:${data.smsNumber}`;
			}
		} catch (error) {
			console.error('Failed to load phone numbers:', error);
		}
	}

	loadPhoneNumbers();
</script>

<style>
	@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');

	.accordion-button:not(.collapsed) {
		background-color: var(--bs-primary);
		color: white;
	}

	.accordion-button:focus {
		box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
	}

	.spinner-border-sm {
		width: 1rem;
		height: 1rem;
	}
</style>
