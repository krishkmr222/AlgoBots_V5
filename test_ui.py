#!/usr/bin/env python3
# Simple test server to view UI improvements
from flask import Flask, render_template, request

app = Flask(__name__)

# Mock version for testing
def get_version():
    return "1.0.0-ui-enhanced"

@app.context_processor
def inject_version():
    return dict(version=get_version())

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    print("🚀 Starting OpenAlgo UI Preview Server...")
    print("📱 Access your enhanced UI at: http://localhost:5000")
    print("✨ UI improvements include:")
    print("   - Enhanced typewriter effect with better looping")
    print("   - Gradient text with pulse animation")
    print("   - Modernized footer with comprehensive links")
    print("   - Enhanced navigation with hover effects")
    print("   - Improved button consistency")
    print("   - Better theme persistence")
    print("   - New testimonials and statistics sections")
    app.run(host='0.0.0.0', port=5000, debug=True)