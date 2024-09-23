export default function FeaturesSection() {
    const features = [
      { title: 'Expert Coaching', description: 'Learn from the best in the game' },
      { title: 'State-of-the-art Facilities', description: 'Train in top-notch environments' },
      { title: 'Team Spirit', description: 'Be part of a close-knit rugby family' },
      { title: 'Competitive Matches', description: 'Test your skills against the best teams' },
    ]
  
    return (
      <section className="py-20 bg-light-grey">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-grey">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }